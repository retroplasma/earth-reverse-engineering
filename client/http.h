/*
------------------------------------------------------------------------------
          Licensing information can be found at the end of the file.
------------------------------------------------------------------------------

http.hpp - v1.0 - Basic HTTP protocol implementation over sockets (no https).

Do this:
    #define HTTP_IMPLEMENTATION
before you include this file in *one* C/C++ file to create the implementation.
*/

#ifndef http_hpp
#define http_hpp

#define _CRT_NONSTDC_NO_DEPRECATE 
#define _CRT_SECURE_NO_WARNINGS
#include <stddef.h> // for size_t

typedef enum http_status_t
    {
    HTTP_STATUS_PENDING,
    HTTP_STATUS_COMPLETED,
    HTTP_STATUS_FAILED,
    } http_status_t;

typedef struct http_t
    {
    http_status_t status;
    int status_code;
    char const* reason_phrase;
    char const* content_type;
    size_t response_size;
    void* response_data;
    } http_t;

http_t* http_get( char const* url, void* memctx );
http_t* http_post( char const* url, void const* data, size_t size, void* memctx );

http_status_t http_process( http_t* http );

void http_release( http_t* http );

#endif /* http_hpp */

/** 

Example
=======

    #define HTTP_IMPLEMENTATION
    #include "http.h"                                                                                                                                                            

    int main( int argc, char** argv )                                                                                                                          
        {                                                                                                                                                       
        (void) argc, argv;
 
        http_t* request = http_get( "http://www.mattiasgustavsson.com/http_test.txt", NULL );
        if( !request )
        {
            printf( "Invalid request.\n" );
            return 1;
        }

        http_status_t status = HTTP_STATUS_PENDING;
        int prev_size = -1;
        while( status == HTTP_STATUS_PENDING )
        {
            status = http_process( request );
            if( prev_size != (int) request->response_size )
            {
                printf( "%d byte(s) received.\n", (int) request->response_size );
                prev_size = (int) request->response_size;
            }
        }

        if( status == HTTP_STATUS_FAILED )
        {
            printf( "HTTP request failed (%d): %s.\n", request->status_code, request->reason_phrase );
            http_release( request );
            return 1;
        }
    
        printf( "\nContent type: %s\n\n%s\n", request->content_type, (char const*)request->response_data );        
        http_release( request );
        return 0;
        }


API Documentation
=================

http.h is a small library for making http requests from a web server. It only supports GET and POST http commands, and
is designed for when you just need a very basic way of communicating over http. http.h does not support https 
connections, just plain http.

http.h is a single-header library, and does not need any .lib files or other binaries, or any build scripts. To use 
it, you just include http.h to get the API declarations. To get the definitions, you must include http.h from 
*one* single C or C++ file, and #define the symbol `HTTP_IMPLEMENTATION` before you do. 


Customization
-------------

### Custom memory allocators

For working memory and to store the retrieved data, http.h needs to do dynamic allocation by calling `malloc`. Programs 
might want to keep track of allocations done, or use custom defined pools to allocate memory from. http.h allows 
for specifying custom memory allocation functions for `malloc` and `free`. This is done with the following code:

    #define HTTP_IMPLEMENTATION
    #define HTTP_MALLOC( ctx, size ) ( my_custom_malloc( ctx, size ) )
    #define HTTP_FREE( ctx, ptr ) ( my_custom_free( ctx, ptr ) )
    #include "http.h"

where `my_custom_malloc` and `my_custom_free` are your own memory allocation/deallocation functions. The `ctx` parameter
is an optional parameter of type `void*`. When `http_get` or `http_post` is called, , you can pass in a `memctx` 
parameter, which can be a pointer to anything you like, and which will be passed through as the `ctx` parameter to every 
`HTTP_MALLOC`/`HTTP_FREE` call. For example, if you are doing memory tracking, you can pass a pointer to your 
tracking data as `memctx`, and in your custom allocation/deallocation function, you can cast the `ctx` param back to the 
right type, and access the tracking data.

If no custom allocator is defined, http.h will default to `malloc` and `free` from the C runtime library.


http_get
--------

    http_t* http_get( char const* url, void* memctx )

Initiates a http GET request with the specified url. `url` is a zero terminated string containing the request location,
just like you would type it in a browser, for example `http://www.mattiasgustavsson.com:80/http_test.txt`. `memctx` is a 
pointer to user defined data which will be passed through to the custom HTTP_MALLOC/HTTP_FREE calls. It can be NULL if 
no user defined data is needed. Returns a `http_t` instance, which needs to be passed to `http_process` to process the
request. When the request is finished (or have failed), the returned `http_t` instance needs to be released by calling
`http_release`. If the request was invalid, `http_get` returns NULL.


http_post
---------

    http_t* http_post( char const* url, void const* data, size_t size, void* memctx )

Initiates a http POST request with the specified url. `url` is a zero terminated string containing the request location,
just like you would type it in a browser, for example `http://www.mattiasgustavsson.com:80/http_test.txt`. `data` is a
pointer to the data to be sent along as part of the request, and `size` is the number of bytes to send. `memctx` is a 
pointer to user defined data which will be passed through to the custom HTTP_MALLOC/HTTP_FREE calls. It can be NULL if 
no user defined data is needed. Returns a `http_t` instance, which needs to be passed to `http_process` to process the
request. When the request is finished (or have failed), the returned `http_t` instance needs to be released by calling
`http_release`. If the request was invalid, `http_post` returns NULL.


http_process
------------

    http_status_t http_process( http_t* http )

http.h uses non-blocking sockets, so after a request have been made by calling either `http_get` or `http_post`, you 
have to keep calling `http_process` for as long as it returns `HTTP_STATUS_PENDING`. You can call it from a loop which 
does other work too, for example from inside a game loop or from a loop which calls `http_process` on multiple requests.
If the request fails, `http_process` returns `HTTP_STATUS_FAILED`, and the fields `status_code` and `reason_phrase` may
contain more details (for example, status code can be 404 if the requested resource was not found on the server). If the 
request completes successfully, it returns `HTTP_STATUS_COMPLETED`. In this case, the `http_t` instance will contain 
details about the result. `status_code` and `reason_phrase` contains the details about the result, as specified in the
HTTP protocol. `content_type` contains the MIME type for the returns resource, for example `text/html` for a normal web
page. `response_data` is the pointer to the received data, and `resonse_size` is the number of bytes it contains. In the
case when the response data is in text format, http.h ensures there is a zero terminator placed immediately after the
response data block, so it is safe to interpret the resonse data as a `char*`. Note that the data size in this case will 
be the length of the data without the additional zero terminator.


http_release
------------

    void http_release( http_t* http )

Releases the resources acquired by `http_get` or `http_post`. Should be call when you are finished with the request.

*/

/*
----------------------
    IMPLEMENTATION
----------------------
*/

#ifdef HTTP_IMPLEMENTATION

#ifdef _WIN32
    #define _CRT_NONSTDC_NO_DEPRECATE 
    #define _CRT_SECURE_NO_WARNINGS
    #pragma warning( push )
    #pragma warning( disable: 4127 ) // conditional expression is constant
    #pragma warning( disable: 4255 ) // 'function' : no function prototype given: converting '()' to '(void)'
    #pragma warning( disable: 4365 ) // 'action' : conversion from 'type_1' to 'type_2', signed/unsigned mismatch
    #pragma warning( disable: 4574 ) // 'Identifier' is defined to be '0': did you mean to use '#if identifier'?
    #pragma warning( disable: 4668 ) // 'symbol' is not defined as a preprocessor macro, replacing with '0' for 'directive'
    #pragma warning( disable: 4706 ) // assignment within conditional expression
    #include <winsock2.h>
    #include <ws2tcpip.h>
    #pragma warning( pop )
    #pragma comment (lib, "Ws2_32.lib") 
    #include <string.h>
    #include <stdio.h>
    #define HTTP_SOCKET SOCKET
    #define HTTP_INVALID_SOCKET INVALID_SOCKET
#else
    #include <stdlib.h>
    #include <stdio.h>
    #include <string.h>
    #include <sys/types.h>
    #include <sys/socket.h>
    #include <unistd.h>
    #include <errno.h>
    #include <fcntl.h>
    #include <netdb.h>
    #define HTTP_SOCKET int
    #define HTTP_INVALID_SOCKET -1
#endif

#ifndef HTTP_MALLOC
    #define _CRT_NONSTDC_NO_DEPRECATE 
    #define _CRT_SECURE_NO_WARNINGS
    #include <stdlib.h>
    #define HTTP_MALLOC( ctx, size ) ( malloc( size ) )
    #define HTTP_FREE( ctx, ptr ) ( free( ptr ) )
#endif

typedef struct http_internal_t 
    {
    /* keep this at the top!*/ 
    http_t http;
    /* because http_internal_t* can be cast to http_t*. */
    
    void* memctx;
    HTTP_SOCKET socket;
    int connect_pending;
    int request_sent;
    char address[ 256 ];
    char request_header[ 256 ];
    char* request_header_large;
    void* request_data;
    size_t request_data_size;
    char reason_phrase[ 1024 ];
    char content_type[ 256 ];
    size_t data_size;
    size_t data_capacity;
    void* data;
    } http_internal_t;


static int http_internal_parse_url( char const* url, char* address, size_t address_capacity, char* port, 
    size_t port_capacity, char const** resource )
    {
    // make sure url starts with http://
    if( strncmp( url, "http://", 7 ) != 0 ) return 0;
    url += 7; // skip http:// part of url
    
    size_t url_len = strlen( url );

    // find end of address part of url
    char const* address_end = strchr( url, ':' );
    if( !address_end ) address_end = strchr( url, '/' );
    if( !address_end ) address_end = url + url_len;

    // extract address
    size_t address_len = (size_t)( address_end - url );
    if( address_len >= address_capacity ) return 0;
    memcpy( address, url, address_len );
    address[ address_len ] = 0;

    // check if there's a port defined
    char const* port_end = address_end;
    if( *address_end == ':' )
        {
        ++address_end;
        port_end = strchr( address_end, '/' );
        if( !port_end ) port_end = address_end + strlen( address_end );
        size_t port_len = (size_t)( port_end - address_end );
        if( port_len >= port_capacity ) return 0;
        memcpy( port, address_end, port_len );
        port[ port_len ] = 0;
        }
    else
        {
        // use default port number 80
        if( port_capacity <= 2 ) return 0;
        strcpy( port, "80" );
        }


    *resource = port_end;

    return 1;
    }


HTTP_SOCKET http_internal_connect( char const* address, char const* port )
    {   
    // set up hints for getaddrinfo
    struct addrinfo hints;
    memset( &hints, 0, sizeof( hints ) );
    hints.ai_family = AF_UNSPEC; // the Internet Protocol version 4 (IPv4) address family.
    hints.ai_flags = AI_PASSIVE;
    hints.ai_socktype = SOCK_STREAM;
    hints.ai_protocol = IPPROTO_TCP;    // Use Transmission Control Protocol (TCP).

    // resolve the server address and port
    struct addrinfo* addri = 0;
    int error = getaddrinfo( address, port, &hints, &addri) ;
    if( error != 0 ) return HTTP_INVALID_SOCKET;

    // create the socket
    HTTP_SOCKET sock = socket( addri->ai_family, addri->ai_socktype, addri->ai_protocol );
    if( sock == -1) 
        {
        freeaddrinfo( addri );
        return HTTP_INVALID_SOCKET;
        }

    // set socket to nonblocking mode
    u_long nonblocking = 1;
    #ifdef _WIN32
        int res = ioctlsocket( sock, FIONBIO, &nonblocking );
    #else
        int flags = fcntl( sock, F_GETFL, 0 );
        int res = fcntl( sock, F_SETFL, flags | O_NONBLOCK ); 
    #endif
    if( res == -1 )
        {
        freeaddrinfo( addri );
        #ifdef _WIN32
            closesocket( sock );
        #else
            close( sock );
        #endif
        return HTTP_INVALID_SOCKET;
        }

    // connect to server
    if( connect( sock, addri->ai_addr, (int)addri->ai_addrlen ) == -1 )
        {
        #ifdef _WIN32
            if( WSAGetLastError() != WSAEWOULDBLOCK && WSAGetLastError() != WSAEINPROGRESS )
                {
                freeaddrinfo( addri );
                closesocket( sock );
                return HTTP_INVALID_SOCKET;
                }
        #else
            if( errno != EWOULDBLOCK && errno != EINPROGRESS && errno != EAGAIN )
                {
                freeaddrinfo( addri );
                close( sock );
                return HTTP_INVALID_SOCKET;
                }
        #endif
        }

    freeaddrinfo( addri );
    return sock;
    }

    
static http_internal_t* http_internal_create( size_t request_data_size, void* memctx )
    {
    http_internal_t* internal = (http_internal_t*) HTTP_MALLOC( memctx, sizeof( http_internal_t ) + request_data_size );

    internal->http.status = HTTP_STATUS_PENDING;
    internal->http.status_code = 0;
    internal->http.response_size = 0;
    internal->http.response_data = NULL;

    internal->memctx = memctx;
    internal->connect_pending = 1;
    internal->request_sent = 0;
    
    strcpy( internal->reason_phrase, "" );
    internal->http.reason_phrase = internal->reason_phrase;

    strcpy( internal->content_type, "" );
    internal->http.content_type = internal->content_type;

    internal->data_size = 0;
    internal->data_capacity = 64 * 1024;
    internal->data = HTTP_MALLOC( memctx, internal->data_capacity );
    
    internal->request_data = NULL;
    internal->request_data_size = 0;
    
    return internal;
    }


http_t* http_get( char const* url, void* memctx )
    {       
    #ifdef _WIN32
        WSADATA wsa_data;
        if( WSAStartup( MAKEWORD( 1, 0 ), &wsa_data ) != 0 ) return NULL;
    #endif
    
    char address[ 256 ];
    char port[ 16 ];
    char const* resource;
    
    if( http_internal_parse_url( url, address, sizeof( address ), port, sizeof( port ), &resource ) == 0 )
        return NULL; 

    HTTP_SOCKET socket = http_internal_connect( address, port );
    if( socket == HTTP_INVALID_SOCKET ) return NULL;
    
    http_internal_t* internal = http_internal_create( 0, memctx );
    internal->socket = socket;

    char* request_header;   
    size_t request_header_len = 64 + strlen( resource ) + strlen( address ) + strlen( port );
    if( request_header_len < sizeof( internal->request_header ) )
        {
        internal->request_header_large = NULL;
        request_header = internal->request_header;
        }
    else
        {
        internal->request_header_large = (char*) HTTP_MALLOC( memctx, request_header_len + 1 );
        request_header = internal->request_header_large;
        }       
    sprintf( request_header, "GET %s HTTP/1.0\r\nHost: %s:%s\r\n\r\n", resource, address, port );
    
    return &internal->http;
    }


http_t* http_post( char const* url, void const* data, size_t size, void* memctx )
    {
    #ifdef _WIN32
        WSADATA wsa_data;
        if( WSAStartup( MAKEWORD( 1, 0 ), &wsa_data ) != 0 ) return 0;
    #endif
    
    char address[ 256 ];
    char port[ 16 ];
    char const* resource;
    
    if( http_internal_parse_url( url, address, sizeof( address ), port, sizeof( port ), &resource ) == 0 )
        return NULL; 

    HTTP_SOCKET socket = http_internal_connect( address, port );
    if( socket == HTTP_INVALID_SOCKET ) return NULL;
    
    http_internal_t* internal = http_internal_create( size, memctx );
    internal->socket = socket;

    char* request_header;   
    size_t request_header_len = 64 + strlen( resource ) + strlen( address ) + strlen( port );
    if( request_header_len < sizeof( internal->request_header ) )
        {
        internal->request_header_large = NULL;
        request_header = internal->request_header;
        }
    else
        {
        internal->request_header_large = (char*) HTTP_MALLOC( memctx, request_header_len + 1 );
        request_header = internal->request_header_large;
        }       
    sprintf( request_header, "POST %s HTTP/1.0\r\nHost: %s:%s\r\nContent-Length: %d\r\n\r\n", resource, address, port, 
        (int) size );
    
    internal->request_data_size = size;
    internal->request_data = ( internal + 1 );
    memcpy( internal->request_data, data, size );
    
    return &internal->http;
    }


http_status_t http_process( http_t* http )
    {
    http_internal_t* internal = (http_internal_t*) http;    
    
    if( http->status == HTTP_STATUS_FAILED ) return http->status;
    
    if( internal->connect_pending )
        {   
        fd_set sockets_to_check; 
        FD_ZERO( &sockets_to_check );
        #pragma warning( push )
        #pragma warning( disable: 4548 ) // expression before comma has no effect; expected expression with side-effect
        FD_SET( internal->socket, &sockets_to_check );
        #pragma warning( pop )
        struct timeval timeout; timeout.tv_sec = 0; timeout.tv_usec = 0;
        // check if socket is ready for send
        if( select( (int)( internal->socket + 1 ), NULL, &sockets_to_check, NULL, &timeout ) == 1 ) 
            {
            int opt = -1;
            socklen_t len = sizeof( opt ); 
            if( getsockopt( internal->socket, SOL_SOCKET, SO_ERROR, (char*)( &opt ), &len) >= 0 && opt == 0 ) 
                internal->connect_pending = 0; // if it is, we're connected
            }
        }

    if( internal->connect_pending ) return http->status;

    if( !internal->request_sent )
        {
        char const* request_header = internal->request_header_large ? 
            internal->request_header_large : internal->request_header;
        if( send( internal->socket, request_header, (int) strlen( request_header ), 0 ) == -1 )
            {
            http->status = HTTP_STATUS_FAILED;
            return http->status;
            }
        if( internal->request_data_size )
            {
            int res = send( internal->socket, (char const*)internal->request_data, (int) internal->request_data_size, 0 );
            if( res == -1 )
                {
                http->status = HTTP_STATUS_FAILED;
                return http->status;
                }
            }
        internal->request_sent = 1;
        return http->status;
        }

    // check if socket is ready for recv
    fd_set sockets_to_check; 
    FD_ZERO( &sockets_to_check );
    #pragma warning( push )
    #pragma warning( disable: 4548 ) // expression before comma has no effect; expected expression with side-effect
    FD_SET( internal->socket, &sockets_to_check );
    #pragma warning( pop )
    struct timeval timeout; timeout.tv_sec = 0; timeout.tv_usec = 0;
    while( select( (int)( internal->socket + 1 ), &sockets_to_check, NULL, NULL, &timeout ) == 1 )
        {
        char buffer[ 4096 ];
        int size = recv( internal->socket, buffer, sizeof( buffer ), 0 );
        if( size == -1 )
            {
            http->status = HTTP_STATUS_FAILED;
            return http->status;
            }
        else if( size > 0 )
            {
            size_t min_size = internal->data_size + size + 1;
            if( internal->data_capacity < min_size )
                {
                internal->data_capacity *= 2; 
                if( internal->data_capacity < min_size ) internal->data_capacity = min_size;
                void* new_data = HTTP_MALLOC( memctx, internal->data_capacity );
                memcpy( new_data, internal->data, internal->data_size );
                HTTP_FREE( memctx, internal->data );
                internal->data = new_data;
                }
            memcpy( (void*)( ( (uintptr_t) internal->data ) + internal->data_size ), buffer, (size_t) size );
            internal->data_size += size;
            }
        else if( size == 0 )
            {
            char const* status_line = (char const*) internal->data;

            int header_size = 0;
            char const* header_end = strstr( status_line, "\r\n\r\n" );
            if( header_end )
                {
                header_end += 4;
                header_size = (int)( header_end - status_line );
                }
            else
                {
                http->status = HTTP_STATUS_FAILED;
                return http->status;
                }

            // skip http version
            status_line = strchr( status_line, ' ' );
            if( !status_line )
                {
                http->status = HTTP_STATUS_FAILED;
                return http->status;
                }
            ++status_line;
            
            // extract status code
            char status_code[ 16 ];
            char const* status_code_end = strchr( status_line, ' ' );
            if( !status_code_end )
                {
                http->status = HTTP_STATUS_FAILED;
                return http->status;
                }
            memcpy( status_code, status_line, (size_t)( status_code_end - status_line ) );
            status_code[ status_code_end - status_line ] = 0;
            status_line = status_code_end + 1;
            http->status_code = atoi( status_code );
            
            // extract reason phrase
            char const* reason_phrase_end = strstr( status_line, "\r\n" );
            if( !reason_phrase_end )
                {
                http->status = HTTP_STATUS_FAILED;
                return http->status;
                }
            size_t reason_phrase_len = (size_t)( reason_phrase_end - status_line );
            if( reason_phrase_len >= sizeof( internal->reason_phrase ) ) 
                reason_phrase_len = sizeof( internal->reason_phrase ) - 1;
            memcpy( internal->reason_phrase, status_line, reason_phrase_len );
            internal->reason_phrase[ reason_phrase_len ] = 0;
            status_line = reason_phrase_end + 1;
            
            // extract content type
            char const* content_type_start = strstr( status_line, "Content-Type: " );
            if( content_type_start )
                {
                content_type_start += strlen( "Content-Type: " );
                char const* content_type_end = strstr( content_type_start, "\r\n" );
                if( content_type_end )
                    {
                    size_t content_type_len = (size_t)( content_type_end - content_type_start );
                    if( content_type_len >= sizeof( internal->content_type ) ) 
                        content_type_len = sizeof( internal->content_type ) - 1;
                    memcpy( internal->content_type, content_type_start, content_type_len );
                    internal->content_type[ content_type_len ] = 0;
                    }
                }

            http->status =  http->status_code < 300 ? HTTP_STATUS_COMPLETED : HTTP_STATUS_FAILED;
            http->response_data = (void*)( ( (uintptr_t) internal->data ) + header_size );
            http->response_size = internal->data_size - header_size;

            // add an extra zero after the received data, but don't modify the size, so ascii results can be used as
            // a zero terminated string. the size returned will be the string without this extra zero terminator.
            ( (char*)http->response_data )[ http->response_size ] = 0;
            return http->status;
            }
        }
    
    return http->status;
    }


void http_release( http_t* http )
    {
    http_internal_t* internal = (http_internal_t*) http;
    #ifdef _WIN32
        closesocket( internal->socket );
    #else
        close( internal->socket );
    #endif

    if( internal->request_header_large) HTTP_FREE( memctx, internal->request_header_large );
    HTTP_FREE( memctx, internal->data );
    HTTP_FREE( memctx, internal );
    #ifdef _WIN32
        WSACleanup();
    #endif
    }


#endif /* HTTP_IMPLEMENTATION */

/*
revision history:
    1.0     first released version  
*/

/*
------------------------------------------------------------------------------

This software is available under 2 licenses - you may choose the one you like.

------------------------------------------------------------------------------

ALTERNATIVE A - MIT License

Copyright (c) 2016 Mattias Gustavsson

Permission is hereby granted, free of charge, to any person obtaining a copy of 
this software and associated documentation files (the "Software"), to deal in 
the Software without restriction, including without limitation the rights to 
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies 
of the Software, and to permit persons to whom the Software is furnished to do 
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all 
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
SOFTWARE.

------------------------------------------------------------------------------

ALTERNATIVE B - Public Domain (www.unlicense.org)

This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or distribute this 
software, either in source code form or as a compiled binary, for any purpose, 
commercial or non-commercial, and by any means.

In jurisdictions that recognize copyright laws, the author or authors of this 
software dedicate any and all copyright interest in the software to the public 
domain. We make this dedication for the benefit of the public at large and to 
the detriment of our heirs and successors. We intend this dedication to be an 
overt act of relinquishment in perpetuity of all present and future rights to 
this software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN 
ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION 
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

------------------------------------------------------------------------------
*/