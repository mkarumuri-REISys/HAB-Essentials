@ECHO OFF

set appcmd="%systemroot%\system32\inetsrv\appcmd"
REM HAB


ECHO.
ECHO Delete PTR Applications
ECHO.

REM HUB

%appcmd% delete app /app.name:"Default Web Site/hab/PtrInternal/App"
%appcmd% delete app /app.name:"Default Web Site/hab/PtrExternal/App"
%appcmd% delete app /app.name:"Default Web Site/hab/PtrInternal"
%appcmd% delete app /app.name:"Default Web Site/hab/PtrExternal"

ECHO.
ECHO Delete PTR Application Pools
ECHO.

%appcmd% delete apppool PTRAppPool


ECHO.
ECHO Delete RSR Applications
ECHO.

REM HUB

%appcmd% delete app /app.name:"Default Web Site/hab/RsrInternal/App"
%appcmd% delete app /app.name:"Default Web Site/hab/RsrExternal/App"
%appcmd% delete app /app.name:"Default Web Site/hab/RsrInternal"
%appcmd% delete app /app.name:"Default Web Site/hab/RsrExternal"

ECHO.
ECHO Delete RSR Application Pools
ECHO.

%appcmd% delete apppool RSRAppPool


ECHO.
ECHO Delete RegLogin Applications
ECHO.

REM HUB

%appcmd% delete app /app.name:"Default Web Site/hab/RegloginApp/App"
%appcmd% delete app /app.name:"Default Web Site/hab/RegloginApp"

ECHO.
ECHO Delete RegLogin Application Pools
ECHO.

%appcmd% delete apppool RegLoginAppPool


ECHO.
ECHO Delete HIVQM Applications
ECHO.

REM HUB

%appcmd% delete app /app.name:"Default Web Site/hab/HIVQMInternal/App"
%appcmd% delete app /app.name:"Default Web Site/hab/HIVQMExternal/App"
%appcmd% delete app /app.name:"Default Web Site/hab/HIVQMInternal"
%appcmd% delete app /app.name:"Default Web Site/hab/HIVQMExternal"

ECHO.
ECHO Delete HIVQM Application Pools
ECHO.

%appcmd% delete apppool HIVQMAppPool


ECHO.
ECHO Delete HAT Applications
ECHO.

REM HUB

%appcmd% delete app /app.name:"Default Web Site/hab/HATInternal/App"
%appcmd% delete app /app.name:"Default Web Site/hab/HATExternal/App"
%appcmd% delete app /app.name:"Default Web Site/hab/HATInternal"
%appcmd% delete app /app.name:"Default Web Site/hab/HATExternal"

ECHO.
ECHO Delete HAT Application Pools
ECHO.

%appcmd% delete apppool HATAppPool


ECHO.
ECHO Delete Aetc Applications
ECHO.

REM HUB

%appcmd% delete app /app.name:"Default Web Site/hab/AetcInternal/App"
%appcmd% delete app /app.name:"Default Web Site/hab/AetcExternal/App"
%appcmd% delete app /app.name:"Default Web Site/hab/AetcInternal"
%appcmd% delete app /app.name:"Default Web Site/hab/AetcExternal"

ECHO.
ECHO Delete Aetc Application Pools
ECHO.

%appcmd% delete apppool AetcAppPool


ECHO.
ECHO Delete Adr Applications
ECHO.

REM HUB

%appcmd% delete app /app.name:"Default Web Site/hab/AdrInternal/App"
%appcmd% delete app /app.name:"Default Web Site/hab/AdrExternal/App"
%appcmd% delete app /app.name:"Default Web Site/hab/AdrInternal"
%appcmd% delete app /app.name:"Default Web Site/hab/AdrExternal"

ECHO.
ECHO Delete Adr Application Pools
ECHO.

%appcmd% delete apppool AdrAppPool


ECHO.
ECHO Delete Hab virtual directory
ECHO.

%appcmd% delete vdir /vdir.name:"Default Web Site/hab"
