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

declare function local:request-params(){
    for $param in request:get-parameter-names()
    return <param name="{$param}" value="{request:get-parameter($param, ())}"/>
};

let $session := request:get-parameter("sid", ())
let $action := request:get-parameter("action", ()) return
switch($action)
case "start" return
    let $location := request:get-parameter("location", ())
    let $id := dbgr:init($location)
    let $wait := util:wait(500)
    return 
        <debug id="{$id}" location="{$location}">
            {
                element {$action} { true() },
                <session>{ dbgr:stack-get($session) }</session>,
                <context>{ dbgr:context-get($session) }</context>
            }
        </debug>
case "stop" return
    let $wait := util:wait(500) return
    <debug id="{$session}">
        {
            element {$action} { dbgr:stop($session) }
        }
    </debug>
case "step" return
    <debug id="{$session}">
        <step name="{$action}">{ dbgr:step-over($session) }</step>
        <session>dbgr:stack-get($session)</session>
        <context>dbgr:context-get($session)</context>
    </debug>
case "step-into" return
    let $wait := util:wait(500) return
    <debug id="{$session}">
        <step name="{$action}">{ dbgr:step-into($session)}</step>
        <session>{ dbgr:stack-get($session) }</session>
        <context>{ dbgr:context-get($session) }</context>
    </debug>
case "step-out" return
    let $wait := util:wait(500) return
    <debug id="{$session}">
        { element {$action} { dbgr:step-out($session) } }
        <session>{ dbgr:stack-get($session) }</session>
        <context>{ dbgr:context-get($session) }</context>
    </debug>
case "stack" return
    <debug id="{$session}">
        <session>{ dbgr:stack-get($session) }</session>
    </debug>
case "variables" return
    <debug id="{$session}">
        <context>{ 
            try{
                dbgr:context-get($session)
            } catch * {
                <response status="fail">
            <message>Error: { $err:description }</message>
            {
                for $param in request:get-parameter-names()
                return <param name="{$param}" value="{request:get-parameter($param, ())}"/>
            }
        </response>
            }}</context>
    </debug>
default return <debuger>Hello from debugger</debuger>