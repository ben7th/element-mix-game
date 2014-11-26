# 元素分组最多 25 个，当显示出来的元素分组数量变化时，按照不同的布局来排列
# 1个分组 布局1
# 2个分组 布局2
# 3-4个分组 布局3
# 5-9个分组 布局4
# 10-16个分组 布局5
# 17-25个分组 布局6

class Layout
  constructor: (@groups)->
    count = @groups.length

    switch
      when count == 1 then @layout1()
      when count == 2 then @layout2()
      when count <= 4 then @layout3()
      when count <= 9 then @layout4()
      when count <= 16 then @layout5()
      when count <= 25 then @layout6()

  layout1: ->
    console.log 'layout 1'
    group = @groups[0]
    group.layout_width = 80
    group.layout_left = 10
    group.layout_top = 10
    group.layout_padding = 10

  layout2: ->
    console.log 'layout 2'
    group0 = @groups[0]
    group1 = @groups[1]

    group0.layout_width = 40
    group1.layout_width = 40

    group0.layout_left = 30
    group1.layout_left = 30

    group0.layout_top = 10
    group1.layout_top = 50

    group0.layout_padding = 10
    group1.layout_padding = 10

  layout3: ->
    console.log 'layout 3'
    for group, idx in @groups
      x = ~~(idx / 2)
      y = idx % 2
      
      group.layout_width = 40
      group.layout_top = 10 + 40 * y
      group.layout_left = 10 + 40 * x
      group.layout_padding = 10

  layout4: ->
    console.log 'layout 4'
    for group, idx in @groups
      x = ~~(idx / 3)
      y = idx % 3
      
      group.layout_width = 26.666
      group.layout_top = 10 + 26.666 * y
      group.layout_left = 10 + 26.666 * x
      group.layout_padding = 10


  layout5: ->
    console.log 'layout 5'
    for group, idx in @groups
      x = ~~(idx / 4)
      y = idx % 4
      
      group.layout_width = 22.5
      group.layout_top = 5 + 22.5 * y
      group.layout_left = 5 + 22.5 * x
      group.layout_padding = 10


  layout6: ->
    console.log 'layout 6'
    for group, idx in @groups
      x = ~~(idx / 5)
      y = idx % 5
      
      group.layout_width = 18
      group.layout_top = 5 + 18 * y
      group.layout_left = 5 + 18 * x
      group.layout_padding = 10


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
      .attr 'data-name', @name
      .attr 'data-group-name', @group.name

    if @icon? and @icon.length > 0
      $element.css 'background-image', "url(data/icons/elements/#{@icon})"
    else
      $element.addClass 'blank'
      $element.html @name

    return $element

  toggle: (side)->
    $area = @group.game.$playground.find(".area.#{side}")
    $element = $area.find(".element[data-name='#{@name}']")

    game = @group.game

    if not $element.hasClass 'active'
      # 如果已经有选中元素，合成
      if game.$active_elm?
        @mix game.$active_elm, $element

      # 如果没有选中元素，选中当前元素
      else
        game.$active_elm = $element
        $area.find('.element').removeClass 'active'
        $element.addClass 'active'
    else
      game.$active_elm = null
      $element.removeClass 'active'

  # 尝试和指定的元素进行合成
  mix: ($el0, $el1)->
    name0 = $el0.data('name')
    name1 = $el1.data('name')
    console.log name0, 'mix with', name1

    # 查找合成公式，判定是否合成成功
    @mix_failed($el0, $el1)

  mix_failed: ($el0, $el1)->
    console.log 'mix failed'

    @group.game.$active_elm = null

    $el0.removeClass('active').addClass('shake')
    $el1.removeClass('active').addClass('shake')

    setTimeout ->
      $el0.removeClass('shake')
      $el1.removeClass('shake')
    , 300


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
      .appendTo $group

    if @icon? and @icon.length > 0
      $icon.css 'background-image', "url(data/icons/#{@icon})"
    else
      $icon.addClass 'blank'
      $icon.html @name

    # 应用 layout
    $group.css
      'width': "#{@layout_width}%"
      'height': "#{@layout_width}%"
      'line-height': "#{@layout_width}%"
      'top': "#{@layout_top}%"
      'left': "#{@layout_left}%"

    $icon.css
      'top': "#{@layout_padding}%"
      'left': "#{@layout_padding}%"
      'right': "#{@layout_padding}%"
      'bottom': "#{@layout_padding}%"


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
      $el.removeClass('hide').addClass('open')
      
      setTimeout ->
        $el.find('.elements').fadeIn 100
      , 300

    else
      $el.find('.elements').hide()
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

    @$active_elm = null

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
    layout = new Layout(@groups)

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

  # url = 'data/elements.json'
  url = 'data/sample1.json'
  # url = 'data/groups-fixture/1-groups.json'
  # url = 'data/groups-fixture/2-groups.json'
  # url = 'data/groups-fixture/4-groups.json'
  # url = 'data/groups-fixture/9-groups.json'
  # url = 'data/groups-fixture/16-groups.json'
  # url = 'data/groups-fixture/25-groups.json'

  new Game($playground).init url