(:
 :  eXide - web-based XQuery IDE
 :  
 :  Copyright (C) 2011 Wolfgang Meier
 :
 :  This program is free software: you can redistribute it and/or modify
 :  it under the terms of the GNU General Public License as published by
 :  the Free Software Foundation, either version 3 of the License, or
 :  (at your option) any later version.
 :
 :  This program is distributed in the hope that it will be useful,
 :  but WITHOUT ANY WARRANTY; without even the implied warranty of
 :  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 :  GNU General Public License for more details.
 :
 :  You should have received a copy of the GNU General Public License
 :  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 :)
(:
 : author Vasiliy Startsev (wstarcev@gmail.com)
:)
xquery version "3.0";

let $session := request:get-parameter("sid", "")
let $action := request:get-parameter("action", "") return
switch($action)
case "start" return
    let $id := dbgr:init(request:get-parameter("location", ()))
    return 
        <debug id="{$id}">
            {
                element {$action} { dbgr:run($id) }
            }
        </debug>
case "stop" return
    <debug id="{$session}">
        {
            element {$action} { dbgr:stop($session) }
        }
    </debug>
case "step" return
    <debug id="{$session}">
        {
            element {$action} { dbgr:step-over($session) },
            dbgr:context-get($session),
            dbgr:stack-get($session)
        }
    </debug>
case "step-into" return
    <debug id="{$session}">
        {
            element {$action} { dbgr:step-into($session) },
            dbgr:context-get($session),
            dbgr:stack-get($session)
        }
    </debug>
case "step-out" return
    <debug id="{$session}">
        {
            element {$action} { dbgr:step-out($session) },
            dbgr:context-get($session),
            dbgr:stack-get($session)
        }
    </debug>
case "stack" return
    <debug id="{$session}">
        {
            dbgr:stack-get($session)
        }
    </debug>
case "variables" return
    <debug id="{$session}">
        {
            dbgr:context-get($session)
        }
    </debug>
default return ()