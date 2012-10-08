/*
 *  eXide - web-based XQuery IDE
 *  
 *  Copyright (C) 2011 Wolfgang Meier
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
eXide.namespace("eXide.XQueryDebuger");

/**
 * XQuery debuger.
 */
eXide.XQueryDebuger = (function () {

	Constr = function(xqDocument) {
        this.forDebugLines = [];
        this.debugContext = "";
        this.main = "xmldb:exist://localhost:8080";
        this.doc = xqDocument;
        try {
            if (!this.doc.isXQuery()) {
                $.log("is not xquery");
//                return null;
            }
        } catch (ex) {
            $.log("is not doc")
//            return null;
        }

        $.log("debuger created")

//        this.forDebugLines = [];

        $.log(this.doc.getPath());
        $.log("Attach debuger for " + this.doc.getMime());
//		if (this.doc.isXQuery()) $.log("We are in XQUERY!!!!!");
	};
	
////	Constr.prototype.startDebug = function(){
////	    $.log(this.doc.getText());
////        $.log(this.doc.getCurrentLine());
////        $.log(this.doc.getPath());
////	};
//
//	Constr.prototype.startDebug = function(doc, code){
//	   var basePath = this.main + doc.getBasePath();
//
//	   $.ajax({
//			type: "GET",
//			url: "modules/debuger.xql?action=stop&sid=" + basePath,
//			success: function (data) {
//				$this.compileError(data, doc);
//				onComplete.call(this, true);
//			},
//			error: function (xhr, status) {
//				onComplete.call(this, true);
//				$.log("Compile error: %s - %s", status, xhr.responseText);
//			}
//		});
//	};

    Constr.prototype.addMarkedLine = function(line){
        $.log("Size " + this.forDebugLines.length);
        $.log("Line index " + this.forDebugLines.indexOf(line))
        if (this.forDebugLines.indexOf(line) < 0) {
            $.log("Line " + line + " added for debug point.");
            this.forDebugLines.push(line);
//            editor.renderer_.addGutterDecoration(line, "debug")
            return true;
        }
        this.forDebugLines.pop(line);
        $.log("Line " + line + " removed from debug lines.");
        return false;
    };

    Constr.prototype.unmarkLine = function(line){
        $.log("remove debuging line " + line);
    };

    Constr.prototype.printAllLines = function(){
        $.log("Count lines for debug " + this.forDebugLines.length);
        var lines = "";
        for (var line = 0; line++ < this.forDebugLines.length;){
            lines += "" + this.forDebugLines[line] + " ";
        }

        $.log("Here is " + lines);
    };

    Constr.prototype.startDebugging = function(){
        this.debug("start");
    };

    Constr.prototype.stopDebugging = function(){
        this.debug("stop");
        this.debugContext = "";
    };

    Constr.prototype.stepNext = function(){
        this.debug("step");
    };

    Constr.prototype.getVariables = function(){
        this.debug("variables");
    };

    Constr.prototype.debug = function(action){
        var $this = this;
        $.ajax({
            type: "POST",
            url: "debug",
            dataType: "xml",
            data: {
                "sid": $this.debugContext,
                "action": action,
                "location": $this.main + $this.doc.getPath()
            },
            success: function (xml) {
                var elem = xml.documentElement;
                if (elem.nodeName == 'debug') {
                    $this.debugContext = $(elem).attr("id");
                    eXide.util.message($(elem).text());
                }
                $.log(action + ": " + $this.debugContext);
            },
            error: function (xhr, status) {
                eXide.util.error(xhr.responseText, "Server Error in session " + $this.debugContext);
            }
        });
    }
	
	// extends ModeHelper
//	eXide.util.oop.inherit(Constr, eXide.XQueryDebuger);
	
	return Constr;
}());