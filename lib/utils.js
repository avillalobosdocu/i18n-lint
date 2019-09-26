/**
 * i18n-lint utils
 *
 * Utility functions for i18n-lint
 *
 * Copyright (c) 2015 James Warwood
 * Licensed under the MIT license.
 */
'use strict';
var ENABLE_DOCUSIGN_REGEX = true;

var isDocuSignResource = function (result) {
	result.status = false;
	if (!ENABLE_DOCUSIGN_REGEX) {
		return false;
	}
	// Testing Docusign Resources and Models
	if (/((^@Resources)|(^@Model))(.\w)+/.test(result.text)) {
		result.status = true;
		result.reason = '@Resource detected | @Model detected';
		return result;
	}
	// Testing Docusign Resources and Models
	if (/((^Resources)|(^Model))(.\w)+/.test(result.text)) {
		result.status = true;
		result.reason = 'Resource detected | Model detected';
		return result;
	}
	// Testing Packages
	if (/^@using.(\w+)(\.\w+)+/.test(result.text)) {
		result.status = true;
		result.reason = '@using detected';
		return result;
	}
	// Testing Packages
	if (/^@model.(\w+)(\.\w+)+/.test(result.text)) {
		result.status = true;
		result.reason = '@model detected';
		return result;
	}
	return result;
};

module.exports = {
	/**
	 * Determine whether or not `str` is a hardcoded string
	 *
	 * @param {String} str  The string to test
	 *
	 * @return {Boolean} true if the string is classed as a hardcoded string,
	 *                   false otherwiser
	 */
	isHardcodedString: function (str) {
		var result = {
			text: str,
			status: false,
			code: null,
			reason: null
		};

		str = str ? str.trim() : null;
		if (!str) {
			result.status = false;
			return result;
		}
		if (/\"\w+(\s+(\w+))+\"/.test(str)) {
			result.status = true;
			result.code = 'W003';
			result.reason = 'double quote string detected';
			return result;
		}
		var validResource = isDocuSignResource(result);
		if (validResource.status) {
			validResource.status = false;
			return validResource;
		}
		// Single, all lowercase words with no single dots
		if (/^([a-z!\?]|[ ]){2,}?(?:[.]{2,})?$/.test(str)) {
			result.status = true;
			result.code = 'W004';
			result.reason = 'Single, all lowercase words with no single dots';
			return result;
		}
		/* Probably a hardcoded string if it contains a capitial letter, or lowercase
		 * letters and spaces
		 */
		if (/([A-Z])/.test(str)) {
	        result.status = true;
	        result.code = 'W005';
			result.reason = 'Probably a hardcoded string if it contains a capitial letter';
	        return result;
		}
		if (/[a-z](?=[ ])/.test(str)) {
	        result.status = true;
	        result.code = 'W006';
	        result.reason = 'Lower case letter and spaces';
	        return result;
		}
		result.status = false;
		result.reason = 'Nothing detected';
		result.code = 'W007';
		return result;
	},
    /**
     * Escape characters in `str` which have a special meaning within a regular
     * expression.
     *
     * @param {String} str  The string to escape
     *
     * @return {String} The escaped string
     */
	escapeRegExp: function (str) {
		return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	},
    /**
     * Append a string of content to an existing RegExp object
     *
     * @param {RegExp} target  The regular expression to append to
     * @param {String} after   The string or regular expression to append
     *
     * @return {RegExp} a new RegExp object
     */
	appendRegExp: function (target, after) {

		// Convert original to string and slice off leading/trailing slashes
		var toString = target.toString().slice(1, -1);

		return new RegExp(toString + after);
	},
    /**
     * Gets the last element of `array`.
     *
     * @param {Array} array The array to query.
     *
     * @returns {*} Returns the last element of `array`.
     */
	getLast: function (array) {
		var length = array == null ? 0 : array.length;
		return length ? array[length - 1] : undefined;
	}
};