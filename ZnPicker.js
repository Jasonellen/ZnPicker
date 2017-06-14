(function(window){
  function ZnPicker(option={}){
    if(option.dataArea){
      this.dataArea = option.dataArea;
      this.min = option.dataArea.min;
      this.max = option.dataArea.max;
      this.length = this.max - this.min;
      this.unit = option.dataArea.unit;
    }else{
      this.dataSource = option.dataSource
    }
    this.title = option.title || '请选择'
    this.defaultSite = option.defaultSite || 1
    this.lineHeight = option.lineHeight || 36;
    this.arrLi=[]
    //直接执行初始化操作
    this.init()
  }
  //初始化
  ZnPicker.prototype.init = function () {
    this.layout(); //布局
		window.onload=()=>{
			this.ulHeight = this.ul.offsetHeight;
      this.boxHeight = this.box.offsetHeight;
			this.drag(); //监听拖拽
	    this.listen(); //监听取消/确定
		}

  };
  //隐藏
  ZnPicker.prototype.hide = function () {
    this.setStyle(this.outBox,{display:'none'})
  };
  //显示
  ZnPicker.prototype.show = function () {
    this.setStyle(this.outBox,{display:'block'})
  };
  //设置样式
  ZnPicker.prototype.setStyle = function (obj, Style={}) {
    let arr =['width', 'height', 'line-height', 'top', 'left', 'bottom', 'right'];
    Object.keys(Style).map(function(key){
      if(arr.indexOf(key) !== -1){
      Style[key] = String(Style[key]).indexOf('px') === -1 && String(Style[key]).indexOf('v') === -1 ? Style[key]+'px' :Style[key]
      }
      obj.style[key] = Style[key]
    })
  };
  //添加元素并布局
  ZnPicker.prototype.layout = function () {
    this.outBox = document.getElementById('ZnPicker')
    this.box = document.createElement('div')
    this.ul = document.createElement('ul')
    if(!this.dataSource && !this.dataArea){
      throw new Error("sorry,你必选传递数据源 dataSource or dataArea")
    }else if(this.dataSource){
      var length = this.dataSource.length
      for(var i=0; i<length; i++){
        let li = document.createElement('li')
        li.innerHTML = this.dataSource[i].name;
        li.index = this.dataSource[i].id
        this.setStyle(li,{'line-height':this.lineHeight,'list-style':'none'})
        this.arrLi.push(li)
        this.ul.appendChild(li)
      }
    }else{
      for(var i=this.min; i<this.max; i++){
        let li = document.createElement('li')
        li.innerHTML = i+this.unit;
        li.index = i
        this.setStyle(li,{'line-height':this.lineHeight,'list-style':'none'})
        this.arrLi.push(li)
        this.ul.appendChild(li)
      }

    }
    this.lineBox = document.createElement('div')
    this.setStyle(this.lineBox,{
      'height': 34,
      'border-top':'1px solid black',
      'border-bottom':'1px solid black',
      'width': 80,
    })
    this.setStyle(this.ul,{
      margin:0,
      width: 80,
      padding:0,
      position: 'absolute',
      'text-align': 'center',
      top: `calc(${this.lineHeight * -this.defaultSite + 3 * this.lineHeight}px  )`,
    })
    this.setStyle(this.box,{
      position: 'fixed',
      width: '100vw',
      height: `calc(${this.lineHeight * 5}px)` ,
      overflow: 'hidden',
      bottom: 0,
      'box-sizing': 'border-box',
      display: 'flex',
      'justify-content': 'center',
      'align-items': 'center',
    })
    this.setStyle(this.outBox,{
      display:'none',
      position: 'fixed',
      bottom: 0,
      width: '100vw',
      height: `calc(${this.lineHeight * 6}px)`,
      border: '1px solid #ddd',
      background:'linear-gradient(top, #ace 20%,#fff 60%, #ace)',
      background:'-o-linear-gradient(top, #ace 20%,#fff 60%, #ace)',
      background:'-moz-linear-gradient(top, #ace 20%,#fff 60%, #ace)',
      background:'-webkit-linear-gradient(top, #ace 20%,#fff 60%, #ace)'
    })
    this.pan = document.createElement('div')
    this.cancel = document.createElement('span')
    this.titleE = document.createElement('span')
    this.ok = document.createElement('span')
    this.cancel.innerHTML = '取消'
    this.titleE.innerHTML = this.title
    this.ok.innerHTML = '确定'
    this.pan.appendChild(this.cancel)
    this.pan.appendChild(this.titleE)
    this.pan.appendChild(this.ok)
    this.setStyle(this.pan,{
      'line-height': 36,
      display: 'flex',
      'justify-content': 'space-around',
    })
    this.box.appendChild(this.lineBox)
    this.box.appendChild(this.ul)
    this.outBox.appendChild(this.pan)
    this.outBox.appendChild(this.box);
    //给该实例添加一系列属性
    this.touchDown = 0; //手指按下的位置
    this._offsetTop =0 ;//记录ul在手指按下的顶部距离
    //设置速度以便做缓冲运动
    this.moveY =0;
    this.speed =0;
    this.timer =null;
  };
  //拖拽操作
  ZnPicker.prototype.drag = function () {
    let _this = this; //指向类实例
    //监听手指按下
    this.ul.addEventListener('touchstart',function(e){
  		var e = e.changedTouches[0]
  		_this.touchDown = e.pageY;
  		_this._offsetTop = this.offsetTop;
  	})
    //监听手指滑动
  	this.ul.addEventListener('touchmove',function(e){
  		var e = e.changedTouches[0]
      _this.setStyle(this,{top:_this._offsetTop + e.pageY - _this.touchDown})
  		//开头和结尾开始拉动设置阻力效果
  		if(this.offsetTop>2*_this.lineHeight || this.offsetTop < _this.boxHeight - _this.ulHeight){
        _this.setStyle(this,{top:_this._offsetTop + (e.pageY-_this.touchDown)/3})
  		}
  		//计算瞬间速度
  		_this.speed = e.pageY - _this.moveY;
  		_this.moveY = e.pageY
  	})
    //监听手指离开
  	this.ul.addEventListener('touchend',function(e){
  		var e = e.changedTouches[0]
  		//如果滑动了距离就执行缓冲运动
  		if(e.pageY - _this.touchDown ){
  			clearInterval(_this.timer)
  			_this.timer = setInterval(()=>{
          _this.setStyle(this,{top:this.offsetTop + _this.speed*1.5})
  				_this.speed *= 0.95;
  				//开头和结尾拉过自动返回
  				if(this.offsetTop>2*_this.lineHeight){
  					clearInterval(_this.timer)
            _this.setStyle(this,{transition:'.3s',top:2*_this.lineHeight})
            this.addEventListener('transitionend',()=>{
              _this.setStyle(this,{transition:'0s'})
            })
  				}else if(this.offsetTop < _this.boxHeight - _this.ulHeight - 2*_this.lineHeight){
  					clearInterval(_this.timer)
            _this.setStyle(this,{transition:'.3s',top:_this.boxHeight - _this.ulHeight- 2*_this.lineHeight})
            this.addEventListener('transitionend',()=>{
              _this.setStyle(this,{transition:'0s'})
            })
          }else if(Math.abs(_this.speed) <=1){
              //速度小于1清除定时器
    					clearInterval(_this.timer)
              _this.setStyle(this,{top:Math.round(this.offsetTop/_this.lineHeight)*_this.lineHeight})
          }
  			},17)
  		}
  	})
  };
  //监听确定、取消按钮
  ZnPicker.prototype.listen = function () {
    var _this = this;
    this.cancel.addEventListener('touchstart',function(){
      _this.hide()
    })
    this.ok.addEventListener('touchstart',function(){
      if(_this.dataArea){
        for(var i=_this.min; i<_this.max; i++){
    			if(Math.abs(_this.arrLi[i-1].offsetTop + _this.ul.offsetTop - _this.lineBox.offsetTop)<3){
            //确定后触发回调
            _this.onChange&&_this.onChange(_this.arrLi[i-1].index)
            _this.hide();
            break;
    			}
    		}
      }else{
        for(var i=0; i<_this.dataSource.length; i++){
    			if(Math.abs(_this.arrLi[i].offsetTop + _this.ul.offsetTop - _this.lineBox.offsetTop)<3){
            //确定后触发回调
            _this.onChange&&_this.onChange(_this.arrLi[i].index)
            _this.hide();
            break;
    			}
    		}
      }
    })
  };
window.ZnPicker = ZnPicker;

})(window)
