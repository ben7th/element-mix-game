(function() {
  var Element, Game, Group, Layout;

  Layout = (function() {
    function Layout(groups) {
      var count;
      this.groups = groups;
      count = this.groups.length;
      switch (false) {
        case count !== 1:
          this.layout1();
          break;
        case count !== 2:
          this.layout2();
          break;
        case !(count <= 4):
          this.layout3();
          break;
        case !(count <= 9):
          this.layout4();
          break;
        case !(count <= 16):
          this.layout5();
          break;
        case !(count <= 25):
          this.layout6();
      }
    }

    Layout.prototype.layout1 = function() {
      var group;
      console.log('layout 1');
      group = this.groups[0];
      group.layout_width = 80;
      group.layout_left = 10;
      group.layout_top = 10;
      return group.layout_padding = 10;
    };

    Layout.prototype.layout2 = function() {
      var group0, group1;
      console.log('layout 2');
      group0 = this.groups[0];
      group1 = this.groups[1];
      group0.layout_width = 40;
      group1.layout_width = 40;
      group0.layout_left = 30;
      group1.layout_left = 30;
      group0.layout_top = 10;
      group1.layout_top = 50;
      group0.layout_padding = 10;
      return group1.layout_padding = 10;
    };

    Layout.prototype.layout3 = function() {
      var group, idx, x, y, _i, _len, _ref, _results;
      console.log('layout 3');
      _ref = this.groups;
      _results = [];
      for (idx = _i = 0, _len = _ref.length; _i < _len; idx = ++_i) {
        group = _ref[idx];
        x = ~~(idx / 2);
        y = idx % 2;
        group.layout_width = 40;
        group.layout_top = 10 + 40 * y;
        group.layout_left = 10 + 40 * x;
        _results.push(group.layout_padding = 10);
      }
      return _results;
    };

    Layout.prototype.layout4 = function() {
      var group, idx, x, y, _i, _len, _ref, _results;
      console.log('layout 4');
      _ref = this.groups;
      _results = [];
      for (idx = _i = 0, _len = _ref.length; _i < _len; idx = ++_i) {
        group = _ref[idx];
        x = ~~(idx / 3);
        y = idx % 3;
        group.layout_width = 26.666;
        group.layout_top = 10 + 26.666 * y;
        group.layout_left = 10 + 26.666 * x;
        _results.push(group.layout_padding = 10);
      }
      return _results;
    };

    Layout.prototype.layout5 = function() {
      var group, idx, x, y, _i, _len, _ref, _results;
      console.log('layout 5');
      _ref = this.groups;
      _results = [];
      for (idx = _i = 0, _len = _ref.length; _i < _len; idx = ++_i) {
        group = _ref[idx];
        x = ~~(idx / 4);
        y = idx % 4;
        group.layout_width = 22.5;
        group.layout_top = 5 + 22.5 * y;
        group.layout_left = 5 + 22.5 * x;
        _results.push(group.layout_padding = 10);
      }
      return _results;
    };

    Layout.prototype.layout6 = function() {
      var group, idx, x, y, _i, _len, _ref, _results;
      console.log('layout 6');
      _ref = this.groups;
      _results = [];
      for (idx = _i = 0, _len = _ref.length; _i < _len; idx = ++_i) {
        group = _ref[idx];
        x = ~~(idx / 5);
        y = idx % 5;
        group.layout_width = 18;
        group.layout_top = 5 + 18 * y;
        group.layout_left = 5 + 18 * x;
        _results.push(group.layout_padding = 10);
      }
      return _results;
    };

    return Layout;

  })();

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
      $element = jQuery('<div>').addClass('element').attr('data-name', this.name).attr('data-group-name', this.group.name);
      if ((this.icon != null) && this.icon.length > 0) {
        jQuery('<div>').addClass('ic').css('background-image', "url(data/icons/elements/" + this.icon + ")").appendTo($element);
        jQuery('<div>').addClass('name').html(this.name).appendTo($element);
      } else {
        $element.addClass('blank');
        $element.html(this.name);
      }
      return $element;
    };

    Element.prototype.toggle = function(side) {
      var $area, $element, game;
      $area = this.group.game.$playground.find(".area." + side);
      $element = $area.find(".element[data-name='" + this.name + "']");
      game = this.group.game;
      if (!$element.hasClass('active')) {
        if (game.$active_elm != null) {
          return this.mix(game.$active_elm, $element);
        } else {
          game.$active_elm = $element;
          $area.find('.element').removeClass('active');
          return $element.addClass('active');
        }
      } else {
        game.$active_elm = null;
        return $element.removeClass('active');
      }
    };

    Element.prototype.mix = function($el0, $el1) {
      var name, name0, name1;
      name0 = $el0.data('name');
      name1 = $el1.data('name');
      console.log(name0, 'mix with', name1);
      name = this.try_mix(name0, name1);
      if (name != null) {
        return this.mix_success($el0, $el1, name);
      } else {
        return this.mix_failed($el0, $el1);
      }
    };

    Element.prototype.mix_success = function($el0, $el1, name) {
      var $_el0, $_el1;
      console.log('mix success', name);
      $el0.closest('.area').addClass('hide');
      $el1.closest('.area').addClass('hide');
      $_el0 = this.dup_position($el0);
      $_el1 = this.dup_position($el1);
      this.group.game.$merge.addClass('show');
      return setTimeout((function(_this) {
        return function() {
          $_el0.addClass('merged');
          $_el1.addClass('merged');
          return setTimeout(function() {
            $_el0.fadeOut(100);
            return $_el1.fadeOut(100, function() {
              var $element, element;
              $_el0.remove();
              $_el1.remove();
              element = _this.group.game.get_element(name);
              $element = element.render();
              $element.addClass('merged').appendTo(_this.group.game.$merge);
              return _this.group.game.$merge.addClass('done');
            });
          }, 500);
        };
      })(this), 200);
    };

    Element.prototype.dup_position = function($el) {
      var $_el, $mg, el_offset, mg_offset;
      $mg = $el.closest('.playground').find('.merge');
      mg_offset = $mg.offset();
      el_offset = $el.offset();
      $_el = $el.clone().removeClass('active').css({
        'left': el_offset.left - mg_offset.left,
        'top': el_offset.top - mg_offset.top
      });
      return $_el.appendTo($mg);
    };

    Element.prototype.mix_failed = function($el0, $el1) {
      console.log('mix failed');
      this.group.game.$active_elm = null;
      $el0.removeClass('active').addClass('shake');
      $el1.removeClass('active').addClass('shake');
      return setTimeout(function() {
        $el0.removeClass('shake');
        return $el1.removeClass('shake');
      }, 300);
    };

    Element.prototype.try_mix = function(name0, name1) {
      return '软盘';
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
      $icon = jQuery('<div>').addClass('icon').appendTo($group);
      if ((this.icon != null) && this.icon.length > 0) {
        $icon.css('background-image', "url(data/icons/" + this.icon + ")");
      } else {
        $icon.addClass('blank');
        $icon.html(this.name);
      }
      $group.css({
        'width': "" + this.layout_width + "%",
        'height': "" + this.layout_width + "%",
        'line-height': "" + this.layout_width + "%",
        'top': "" + this.layout_top + "%",
        'left': "" + this.layout_left + "%"
      });
      $icon.css({
        'top': "" + this.layout_padding + "%",
        'left': "" + this.layout_padding + "%",
        'right': "" + this.layout_padding + "%",
        'bottom': "" + this.layout_padding + "%"
      });
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
        $el.removeClass('hide').addClass('open');
        return setTimeout(function() {
          return $el.find('.elements').fadeIn(100);
        }, 300);
      } else {
        $el.find('.elements').hide();
        $el.find('.element').removeClass('active');
        if (this.game.$active_elm.data('name') === $el.find('.element').data('name')) {
          this.game.$active_elm = null;
        }
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
      this.$merge = this.$playground.find('.merge');
      this.$left_area_groups = this.$playground.find('.area.left .groups');
      this.$right_area_groups = this.$playground.find('.area.right .groups');
      this.groups = [];
      this.bind_events();
      this.$active_elm = null;
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

    Game.prototype.get_element = function(name) {
      var element, group, _i, _len, _ref;
      _ref = this.groups;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        group = _ref[_i];
        element = group.get_element(name);
        if (element != null) {
          return element;
        }
      }
      return null;
    };

    Game.prototype.render_groups = function() {
      var group, layout, _i, _len, _ref, _results;
      layout = new Layout(this.groups);
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
      this.$playground.delegate('.area .groups .group .element', 'click', function() {
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
      return jQuery(document.body).on('click', (function(_this) {
        return function() {
          if (_this.$merge.hasClass('done')) {
            _this.$merge.removeClass('show').removeClass('done');
            _this.$merge.find('.element').remove();
            _this.$playground.find('.area').removeClass('hide');
            _this.$active_elm.removeClass('active');
            _this.$playground.find('.groups .group').removeClass('hide').removeClass('open');
            return _this.$playground.find('.elements').hide();
          }
        };
      })(this));
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