
//
// element queries
mcrmade = {};

mcrmade.elementQueries = function(el, options) {

	if (el) {

		this.init(el, options);
	}
}

$.extend(mcrmade.elementQueries.prototype, {

	// plugin name
	name: 'mcrmade_elementQueries',

	defaults: {
		breakpoints: {
			0: {
				name: 'base'
			}
		},
		prefix: 'eq-'
	},

	// initialise the plugin
	init: function(el, options) {

		this.element = $(el);

		$.data(this.element, this.name, this);

		this.options = $.extend(true, {}, this.defaults, options);

		for (var i in this.options.breakpoints) {

			if (!this.options.breakpoints[i].name) {

				this.options.breakpoints[i].name = this.options.prefix + i;
			} else {

				this.options.breakpoints[i].name = this.options.prefix + this.options.breakpoints[i].name;
			}
		}

		// this.addBreakpoints();

		this.testBreakpoints();

		this.bind();

		return this;
	},

	// bind events to this instance's methods
	bind: function() {

		this.element.bind('destroyed', $.proxy(this.teardown, this));

		$(window).on('throttledresize', $.proxy(this.testBreakpoints, this));
	},

	// call destroy to teardown whilst leaving the element
	destroy: function() {

		this.element.unbind('destroyed', this.teardown());

		this.teardown();
	},

	// remove plugin functionality
	teardown: function() {

		$.removeData(this.element[0], this.name);

		this.removeBreakpoints();

		this.element = null;

		this.unbind();
	},

	unbind: function() {

		$(window).off('throttledresize', $.proxy(this.testBreakpoints, this));
	},

	addBreakpoints: function() {

		for (var i in this.options.breakpoints) {

			this.element.addClass(this.options.breakpoints[i].name);
		}
	},

	removeBreakpoints: function() {

		this.element.attr('class', function(i, c){

			var pattern = '/\b' + this.options.prefix + '\S+/g';
			return c.replace(pattern, '');
		});
	},

	testBreakpoints: function() {

		for (var i in this.options.breakpoints) {

			if (this.element.parent().innerWidth() >= i) {

				if (!this.options.breakpoints[i].active) {

					this.activateBreakpoint(this.options.breakpoints[i]);
				}
			} else {

				if (this.options.breakpoints[i].active) {

					this.deactivateBreakpoint(this.options.breakpoints[i]);
				}
			}
		}
	},

	activateBreakpoint: function(breakpoint) {

		breakpoint.active = true;

		this.element.addClass(breakpoint.name);

		this.activateMethods(breakpoint);
	},

	deactivateBreakpoint: function(breakpoint) {

		breakpoint.active = false;

		this.element.removeClass(breakpoint.name);

		this.deactivateMethods(breakpoint);
	},

	activateMethods: function(breakpoint) {

		if (
			breakpoint.activated &&
			typeof breakpoint.activated == 'function'
		) {

			breakpoint.activated.call();
		}
	},

	deactivateMethods: function(breakpoint) {

		if (
			breakpoint.deactivated &&
			typeof breakpoint.deactivated == 'function'
		) {

			breakpoint.deactivated.call();
		}
	}
});



//
// make plugin
$.pluginMaker(mcrmade.elementQueries);
