# 元素
class Element
  constructor: (@group, data)->
    @name = data.name
    @icon = data.icon
    @desc = data.desc

    # 初始化时是否显示
    @done = data.done
    @group.show = true if @done

  # 构造 dom
  render: ->
    $element = jQuery '<div>'
      .addClass 'element'
      .html @name
      .attr 'data-name', @name
      .attr 'data-group-name', @group.name

    return $element

  toggle: (side)->
    $area = @group.game.$playground.find(".area.#{side}")
    $element = $area.find(".element[data-name='#{@name}']")

    if not $element.hasClass 'active'
      $area.find('.element').removeClass 'active'
      $element.addClass 'active'
    else
      $element.removeClass 'active'


# 元素分组
class Group
  constructor: (@game, data)->
    @name = data.name
    @icon = data.icon
    @desc = data.desc
    @elements = []

    # 初始化时是否显示
    @show = false

    for element_data in data.elements
      element = new Element @, element_data
      @elements.push element

  render: ->
    $group = jQuery('<div>')
      .addClass('group')
      .attr 'data-name', @name

    $icon = jQuery '<div>'
      .addClass 'icon'
      .html @name
      .appendTo $group

    $elements = jQuery '<div>'
      .addClass 'elements'
      .appendTo $group

    for element in @elements
      element.render().appendTo $elements

    @$left_el = $group.clone()
    @$right_el = $group.clone()

    @els = {
      'left': @$left_el
      'right': @$right_el
    }

    @game.$left_area_groups.append @$left_el
    @game.$right_area_groups.append @$right_el

  toggle: (side)->
    # 打开/关闭指定一侧的分组
    $el = @els[side]
    if not $el.hasClass('open')
      $el.closest('.area').find('.groups .group').addClass 'hide'
      $el
        .removeClass 'hide'
        .addClass 'open'
    else
      $el.find('.element').removeClass 'active'

      $el.removeClass 'open'
      setTimeout ->
        $el.closest('.area').find('.groups .group').removeClass 'hide'
      , 300

  get_element: (name)->
    for element in @elements
      return element if "#{element.name}" == "#{name}"
    return null


class Game
  constructor: (@$playground)->
    @$left_area_groups = @$playground.find('.area.left .groups')
    @$right_area_groups = @$playground.find('.area.right .groups')

    @groups = []
    @bind_events()
    # @create_fsm()

  init: (json_url)->
    # 载入分组数据
    jQuery.getJSON json_url, (data)=>
      for group_data in data.groups
        group = new Group @, group_data
        @groups.push group

      @render_groups()

  # 根据分组名获取分组
  get_group: (name)->
    for group in @groups
      return group if group.name is name
    return null

  # 显示分组
  render_groups: ->
    for group in @groups
      if group.show
        group.render()

  # 事件绑定
  bind_events: ->
    that = @

    # 点击分组
    @$playground.delegate '.area .groups .group .icon', 'click', ->
      $group = jQuery(@).closest('.group')
      name = $group.data('name')

      group = that.get_group(name)
      side = $group.closest('.area').data('side')

      # 找到并打开/关闭分组
      group.toggle(side) if group?

    # 点击元素
    @$playground.delegate '.area .groups .group .element', 'click', ->
      $element = jQuery(@)
      name = $element.data('name')
      group_name = $element.data('group-name')
      # console.log name, group_name
      group = that.get_group group_name
      element = group.get_element name

      side = $element.closest('.area').data('side')

      # 选中/取消选中点击的元素
      element.toggle(side) if element?


jQuery ->
  $playground = jQuery('.playground')

  url = 'data/elements.json'
  # url = 'data/sample1.json'

  new Game($playground).init url
