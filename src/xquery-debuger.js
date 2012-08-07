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
	
	Constr = function(editor) {
		this.parent = editor;
		this.editor = this.parent.editor;
		
	}
	
	Constr.prototype.startDebug = function(){
	   var basePath = "xmldb:exist://" + this.parent.getActiveDocument().getBasePath();
	   
	   $.ajax({
			type: "GET",
			url: "modules/debuger.xql?action=start&location=" + basePath,
			success: function (data) {
				$this.compileError(data, doc);
				onComplete.call(this, true);
			},
			error: function (xhr, status) {
				onComplete.call(this, true);
				$.log("Compile error: %s - %s", status, xhr.responseText);
			}
		});
	}
	
	Constr.prototype.stoptDebug = function(doc, code){
	   var basePath = "xmldb:exist://" + doc.getBasePath();
	   
	   $.ajax({
			type: "GET",
			url: "modules/debuger.xql?action=stop&sid=" + basePath,
			success: function (data) {
				$this.compileError(data, doc);
				onComplete.call(this, true);
			},
			error: function (xhr, status) {
				onComplete.call(this, true);
				$.log("Compile error: %s - %s", status, xhr.responseText);
			}
		});
	}
	
	// extends ModeHelper
	eXide.util.oop.inherit(Constr, eXide.XQueryDebuger);
	
	return Constr;
}());