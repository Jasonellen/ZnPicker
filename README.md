# ZnPicker
##### 移动端选择器开发，基于原生JS，无任何依赖，体积小（压缩后仅4k）
### 使用示例

  <body>
    <div id="ZnPicker"></div>
    <script src='ZnPicker.js'></script>
    <script>
      var picker=new ZnPicker({
        dataArea:{min:1,max:199,unit:'岁'},
        // dataSource:[{name:'张三',id:1},{name:'李四',id:2},{name:'王五',id:3}],
        title:'请选择年龄',
        defaultSite: 122,
        lineHeight:36
      })
      picker.show()
      picker.onChange=function(data){
        alert(data)
      }
    </script>
  </body>
  
### 参数说明

|Options/callBack|Description|Required|
| :-----------: |:-------------:|------:|
| title      | Picker标题 | false |
| defaultSite      | 默认起始位置      |   false |
|  lineHeight | 单个行高      |   false |
|  dataArea      | 区间数据源，和dataSource有且只有一个/callback返回区间数 | true |
| dataSource      | 列表数据源，和dataArea有且只有一个/callback返回数据id      |  true |
| show | Picker显示     |    / |
| onChange      | 选中后的回调函数 | / |
