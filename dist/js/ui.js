(function() {
  var Element, Game, Group;

  Element = (function() {
    function Element(group, data) {
      this.group = group;
      this.name = data.name;
      this.icon = data.icon;
      this.desc = data.desc;
      this.done = data.done;
      if (this.done) {
        this.group.show = true;
      }
    }

    Element.prototype.render = function() {
      var $element;
      $element = jQuery('<div>').addClass('element').html(this.name).attr('data-name', this.name).attr('data-group-name', this.group.name);
      return $element;
    };

    Element.prototype.toggle = function(side) {
      var $area, $element;
      $area = this.group.game.$playground.find(".area." + side);
      $element = $area.find(".element[data-name='" + this.name + "']");
      if (!$element.hasClass('active')) {
        $area.find('.element').removeClass('active');
        return $element.addClass('active');
      } else {
        return $element.removeClass('active');
      }
    };

    return Element;

  })();

  Group = (function() {
    function Group(game, data) {
      var element, element_data, _i, _len, _ref;
      this.game = game;
      this.name = data.name;
      this.icon = data.icon;
      this.desc = data.desc;
      this.elements = [];
      this.show = false;
      _ref = data.elements;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        element_data = _ref[_i];
        element = new Element(this, element_data);
        this.elements.push(element);
      }
    }

    Group.prototype.render = function() {
      var $elements, $group, $icon, element, _i, _len, _ref;
      $group = jQuery('<div>').addClass('group').attr('data-name', this.name);
      $icon = jQuery('<div>').addClass('icon').html(this.name).appendTo($group);
      $elements = jQuery('<div>').addClass('elements').appendTo($group);
      _ref = this.elements;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        element = _ref[_i];
        element.render().appendTo($elements);
      }
      this.$left_el = $group.clone();
      this.$right_el = $group.clone();
      this.els = {
        'left': this.$left_el,
        'right': this.$right_el
      };
      this.game.$left_area_groups.append(this.$left_el);
      return this.game.$right_area_groups.append(this.$right_el);
    };

    Group.prototype.toggle = function(side) {
      var $el;
      $el = this.els[side];
      if (!$el.hasClass('open')) {
        $el.closest('.area').find('.groups .group').addClass('hide');
        return $el.removeClass('hide').addClass('open');
      } else {
        $el.find('.element').removeClass('active');
        $el.removeClass('open');
        return setTimeout(function() {
          return $el.closest('.area').find('.groups .group').removeClass('hide');
        }, 300);
      }
    };

    Group.prototype.get_element = function(name) {
      var element, _i, _len, _ref;
      _ref = this.elements;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        element = _ref[_i];
        if (("" + element.name) === ("" + name)) {
          return element;
        }
      }
      return null;
    };

    return Group;

  })();

  Game = (function() {
    function Game($playground) {
      this.$playground = $playground;
      this.$left_area_groups = this.$playground.find('.area.left .groups');
      this.$right_area_groups = this.$playground.find('.area.right .groups');
      this.groups = [];
      this.bind_events();
    }

    Game.prototype.init = function(json_url) {
      return jQuery.getJSON(json_url, (function(_this) {
        return function(data) {
          var group, group_data, _i, _len, _ref;
          _ref = data.groups;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            group_data = _ref[_i];
            group = new Group(_this, group_data);
            _this.groups.push(group);
          }
          return _this.render_groups();
        };
      })(this));
    };

    Game.prototype.get_group = function(name) {
      var group, _i, _len, _ref;
      _ref = this.groups;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        group = _ref[_i];
        if (group.name === name) {
          return group;
        }
      }
      return null;
    };

    Game.prototype.render_groups = function() {
      var group, _i, _len, _ref, _results;
      _ref = this.groups;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        group = _ref[_i];
        if (group.show) {
          _results.push(group.render());
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Game.prototype.bind_events = function() {
      var that;
      that = this;
      this.$playground.delegate('.area .groups .group .icon', 'click', function() {
        var $group, group, name, side;
        $group = jQuery(this).closest('.group');
        name = $group.data('name');
        group = that.get_group(name);
        side = $group.closest('.area').data('side');
        if (group != null) {
          return group.toggle(side);
        }
      });
      return this.$playground.delegate('.area .groups .group .element', 'click', function() {
        var $element, element, group, group_name, name, side;
        $element = jQuery(this);
        name = $element.data('name');
        group_name = $element.data('group-name');
        group = that.get_group(group_name);
        element = group.get_element(name);
        side = $element.closest('.area').data('side');
        if (element != null) {
          return element.toggle(side);
        }
      });
    };

    return Game;

  })();

  jQuery(function() {
    var $playground, url;
    $playground = jQuery('.playground');
    url = 'data/sample1.json';
    return new Game($playground).init(url);
  });

}).call(this);

//# sourceMappingURL=../maps/ui.js.map