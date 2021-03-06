/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * (c) Copyright 2009-2013 SAP AG or an SAP affiliate company. 
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides a log viewer for debug purposes
jQuery.sap.declare("sap.ui.debug.LogViewer");

/**
 * Constructs a LogViewer in the given window, embedded into the given DOM element.
 * If the DOM element doesn't exist, a DIV is created.
 *
 * @param {Window} oTargetWindow the window where the log will be displayed in
 * @param {sRootId} sRootId id of the top level element that will contain the log entries
 *
 * @class HTML LogViewer that displays all entries of a Logger, as long as they match a filter and a minimal log level
 */
sap.ui.debug.LogViewer = function(oWindow, sRootId) {
	this.oWindow = oWindow;
	this.oDomNode = oWindow.document.getElementById(sRootId);
	if (!this.oDomNode) {
		var oDiv = this.oWindow.document.createElement("DIV");
		oDiv.setAttribute("id", sRootId);
		oDiv.style.overflow="auto";
		oDiv.style.tabIndex="-1";
		oDiv.style.position="absolute";
		oDiv.style.bottom="0px";
		oDiv.style.left="0px";
		oDiv.style.right="202px";
		oDiv.style.height="200px";
		oDiv.style.border="1px solid gray";
		oDiv.style.fontFamily = "Arial monospaced for SAP,monospace";
		oDiv.style.fontSize   = "11px";
		oDiv.style.zIndex = "999999";
		this.oWindow.document.body.appendChild(oDiv);
		this.oDomNode = oDiv;
	}
	this.iLogLevel = 3; /* jQuery.sap.log.LogLevel.INFO */
	this.sLogEntryClassPrefix = undefined;
	this.clear();
	this.setFilter(sap.ui.debug.LogViewer.NO_FILTER);
};

sap.ui.debug.LogViewer.NO_FILTER = function(oLogMessage) { return true; };

sap.ui.debug.LogViewer.prototype.clear = function() {
	this.oDomNode.innerHTML = "";
};

/**
 * Returns an XML escaped version of a given string sText
 * @param {string} sText the string that is escaped.
 * @return {string} an XML escaped version of a given string sText
 * @private
 */
sap.ui.debug.LogViewer.xmlEscape = function(sText) {
	sText = sText.replace(/\&/g, "&amp;");
	sText = sText.replace(/\</g, "&lt;");
	sText = sText.replace(/\"/g, "&quot;");
	return sText;
};
/**
 * Renders a single log entry to the DOM. Could be overwritten in subclasses.
 * @protected
 */
sap.ui.debug.LogViewer.prototype.addEntry = function(oLogEntry) {

	var oDomEntry = this.oWindow.document.createElement("div");

	// style the entry
	if ( this.sLogEntryClassPrefix ) {
		// note: setting a class has only an effect when the main.css is loaded (testsuite)
		oDomEntry.className = this.sLogEntryClassPrefix + oLogEntry.level;
	} else {
		oDomEntry.style.overflow="hidden";
		oDomEntry.style.textOverflow="ellipsis";
		oDomEntry.style.height="1.3em";
		oDomEntry.style.width="100%";
		oDomEntry.style.whiteSpace="noWrap";
	}

	// create text as text node
	var sText = sap.ui.debug.LogViewer.xmlEscape(oLogEntry.time + "  " + oLogEntry.message),
		oTextNode = this.oWindow.document.createTextNode(sText);
	oDomEntry.appendChild(oTextNode);
	oDomEntry.title = oLogEntry.message;

	// filter
	oDomEntry.style.display = this.oFilter(sText) ? "" : "none";

	this.oDomNode.appendChild(oDomEntry);

	return oDomEntry;
};

sap.ui.debug.LogViewer.prototype.fillFromLogger = function(iFirstEntry) {
	this.clear();
	this.iFirstEntry = iFirstEntry;
	if ( !this.oLogger ) {
		return;
	}

	// when attached to a log, clear the dom node and add all entries from the log
	var aLog = this.oLogger.getLog();
	for (var i=this.iFirstEntry,l=aLog.length;i<l;i++) {
		if ( aLog[i].level <= this.iLogLevel ) {
			this.addEntry(aLog[i]);
		}
	}

	this.scrollToBottom();
};

sap.ui.debug.LogViewer.prototype.scrollToBottom = function() {
	this.oDomNode.scrollTop = this.oDomNode.scrollHeight;
};

sap.ui.debug.LogViewer.prototype.truncate = function() {
	this.clear();
	this.fillFromLogger(this.oLogger.getLog().length);
};

sap.ui.debug.LogViewer.prototype.setFilter = function(oFilter) {
	this.oFilter = oFilter = oFilter || sap.ui.debug.LogViewer.NO_FILTER;
	var childNodes = this.oDomNode.childNodes;
	for (var i=0,l=childNodes.length; i<l; i++) {
		var sText = childNodes[i].innerText;
		if (!sText) {
			sText = childNodes[i].innerHTML;
		}
		childNodes[i].style.display = oFilter(sText) ? "" : "none";
	}
	this.scrollToBottom();
};

sap.ui.debug.LogViewer.prototype.setLogLevel = function(iLogLevel) {
	this.iLogLevel = iLogLevel;
	if ( this.oLogger ) {
		this.oLogger.setLevel(iLogLevel);
	}
	// fill and filter again
	this.fillFromLogger(this.iFirstEntry);
};

sap.ui.debug.LogViewer.prototype.lock = function() {
	this.bLocked = true;
	//this.oDomNode.style.backgroundColor = 'gray'; // marker for 'locked' state
};

sap.ui.debug.LogViewer.prototype.unlock = function() {
	this.bLocked = false;
	//this.oDomNode.style.backgroundColor = ''; // clear 'locked' marker
	this.fillFromLogger(0);
	// this.addEntry({ time : '---------', message: '---------------', level : 3});
};

sap.ui.debug.LogViewer.prototype.onAttachToLog = function(oLogger) {
	this.oLogger = oLogger;
	this.oLogger.setLevel(this.iLogLevel);
	if ( !this.bLocked ) {
		this.fillFromLogger(0);
	}
};

sap.ui.debug.LogViewer.prototype.onDetachFromLog = function(oLogger) {
	this.oLogger = undefined;
	this.fillFromLogger(0); // clears the viewer
};

sap.ui.debug.LogViewer.prototype.onLogEntry = function(oLogEntry) {
	if ( !this.bLocked ) {
		var oDomRef = this.addEntry(oLogEntry);
		if ( oDomRef && oDomRef.style.display !== 'none' ) {
			this.scrollToBottom();
		}
	}
};