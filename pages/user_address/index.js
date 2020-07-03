import { editAddress, getAddressDetail,getprovince,getAllCity} from '../../api/user.js';
import { getCity } from '../../api/api.js';

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '添加地址'
    },
    // region: ['省', '市', '区'],
    // valueRegion: [0, 0, 0],
    cartId:'',//购物车id
    pinkId:0,//拼团id
    couponId:0,//优惠券id
    id:0,//地址id
    userAddress: { is_default:false},//地址详情
    cityId:0,
    district:[],
    // multiArray:[],
    multiIndex: [0, 0, 0],
    youAddress:"",//地区
    isShowCity:false,//地址选择弹出层
    province:{name:"请选择",id:""},//省
    city:{name:"",id:""},//市
    district:{name:"",id:""},//区
    county:{name:"",id:""},//县
    provinceAll:[],//所有省份
    cityAll:[],//所有市
    districtAll:[],//所有区
    countyAll:[],//所有县
    indexNow:1,//当前是省市区县哪一个显示
  },
  /**
   * 授权回调
   * 
  */
  onLoadFun:function(){
    this.getUserAddress();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      cartId: options.cartId || '',
      pinkId: options.pinkId || 0,
      couponId: options.couponId || 0,
      id: options.id || 0,
      'parameter.title': options.id ? '修改地址' : '添加地址'
    });
    // this.getCityList();
  },
  // getCityList:function(){
  //   let that = this;
  //   getCity().then(res=>{
  //     that.setData({ district:res.data});
  //     that.initialize();
  //   })
  // },
  // initialize:function(){
  //   let that = this, province = [], city = [], area = [];
  //   if (that.data.district.length) {
  //     let cityChildren = that.data.district[0].c || [];
  //     let areaChildren = cityChildren.length ? (cityChildren[0].c || []) : [];
  //     that.data.district.forEach(function (item) {
  //       province.push(item.n);
  //     });
  //     cityChildren.forEach(function (item) {
  //       city.push(item.n);
  //     });
  //     areaChildren.forEach(function (item) {
  //       area.push(item.n);
  //     });
  //     that.setData({
  //       multiArray: [province, city, area],
  //     });
  //   }
  // },
  // bindRegionChange: function (e) {
  //   let multiIndex = this.data.multiIndex, province = this.data.district[multiIndex[0]] || { c: [] }, city = province.c[multiIndex[1]] || { v: 0 }, multiArray = this.data.multiArray, value = e.detail.value;
  //   console.log(value);
  //   console.log(province);
  //   this.setData({
  //     region: [multiArray[0][value[0]], multiArray[1][value[1]], multiArray[2][value[2]]],
  //     cityId: city.v,
  //     valueRegion: [0,0,0]
  //   });
  //   this.initialize();
  // },
   // 打开地址选择
   open(){
    var that=this
    that.setData({
      isShowCity:true
    })
    that.setData({
      indexNow:that.data.indexNow-1
    })
    // 获取省份
    getprovince().then(res=>{
      if(res.status==200){
        that.setData({
          provinceAll:res.data
        })
      }else{
        app.Tips({title: res.msg})
      }
    }).catch(err=>{
      app.Tips("请求失败，请稍后重试~")
    })
  },
  // 选择省市区县
  selectAllCity(e){
    var that=this
    var id=e.currentTarget.dataset.id//省市区县id
    var name=e.currentTarget.dataset.name//省市区县名字
    that.setData({//当前选中的省市区县
      indexNow:that.data.indexNow+1,
    })
    var url
    if(that.data.indexNow==1){//为1时省份名字
      url="getcity"
      that.setData({
        province:{name,id},
      })
    }else if(that.data.indexNow==2){//为2时市的名字
      url="gettowon",
      that.setData({
        city:{name,id},
      })
    }else if(that.data.indexNow==3){//为3时区的名字
      url="street"
      that.setData({
        district:{name,id},
      })
    }else{
      that.setData({
        county:{name,id},
        youAddress:that.data.province.name+that.data.city.name+that.data.district.name+name,
        isShowCity:false
      })
    }
    // 如果打开了地址选择则可以发起请求
    if(that.data.isShowCity){
      getAllCity(url,id).then(res=>{
        if(res.status==200){
          console.log(that.data.indexNow)
          // 判断是否有数据
          if(res.data){
            // 当当前下标为1，2，3时分别对应城市，区，镇
            if(that.data.indexNow==1){
              that.setData({
                cityAll:res.data,
                city:{name:"请选择",id:""},
                district:{name:"",id:""},
                county:{name:"",id:""}
              })
              console.log(that.data.city)
            }else if(that.data.indexNow==2){
              that.setData({
                districtAll:res.data,
                district:{name:"请选择",id:""},
                county:{name:"",id:""}
              })
            }else if(that.data.indexNow==3){
              that.setData({
                countyAll:res.data,
                county:{name:"请选择",id:""}
              })
            }
          }else{
            // 如果没有数据则判断当前为第几区
            if(that.data.indexNow==1){
              that.setData({
                youAddress:that.data.province.name,
                city:{name:"",id:""},
                district:{name:"",id:""},
                county:{name:"",id:""}
              })
            }else if(that.data.indexNow==2){
              that.setData({
                youAddress:that.data.province.name+that.data.city.name,
                district:{name:"",id:""},
                county:{name:"",id:""}
              })
            }else if(that.data.indexNow==3){
              that.setData({
                youAddress:that.data.province.name+that.data.city.name+that.data.district.name,
                county:{name:"",id:""}
              })
            }
            // 没有数据则关闭
            that.setData({
              isShowCity:false
            })
          }
        }else{
          app.Tips(res.msg)
        } 
      }).catch(err=>{
        app.Tips("请求失败，请稍后重试~")
      })
    }
  },
  // 关闭城市选择弹窗
  onClose2(){
    var that=this
    that.setData({ isShowCity:false,indexNow:that.data.indexNow+1 });
  },
  // 选择地址切换
  changeCity(e){
    var that=this
    that.setData({
      indexNow:Number(e.currentTarget.dataset.index)
    })
  },
  // bindMultiPickerColumnChange:function(e){
  //   let that = this, column = e.detail.column, value = e.detail.value, currentCity = this.data.district[value] || { c: [] }, multiArray = that.data.multiArray, multiIndex = that.data.multiIndex;
  //   multiIndex[column] = value;
  //   switch (column){
  //     case 0:
  //       let areaList = currentCity.c[0] || { c: [] };
  //       multiArray[1] = currentCity.c.map((item)=>{
  //         return item.n;
  //       });
  //       multiArray[2] = areaList.c.map((item)=>{
  //         return item.n;
  //       });
  //     break;
  //     case 1:
  //       let cityList = that.data.district[multiIndex[0]].c[multiIndex[1]].c || [];
  //       multiArray[2] = cityList.map((item)=>{
  //         return item.n;
  //       });
  //     break;
  //     case 2:
      
  //     break;
  //   }
  //   this.setData({ multiArray: multiArray, multiIndex: multiIndex});
  // },
  getUserAddress:function(){
    if(!this.data.id) return false;
    let that = this;
    getAddressDetail(this.data.id).then(res=>{
      that.setData({
        userAddress: res.data,
        province:{name:res.data.province,id:res.data.province_id},
        city:{name:res.data.city,id:res.data.city_id},
        district:{name:res.data.district,id:res.data.district_id},
        county:{name:res.data.stree,id:res.data.stree_id},
        youAddress:res.data.province+res.data.city+res.data.district+res.data.stree,
      });
      // 获取市
      getAllCity('getcity',res.data.province_id).then(res=>{
        if(res.status==200){
          that.setData({
            cityAll:res.data
          })
        }
      }).catch(err=>{
        app.Tips("请求失败，请稍后重试~")
      })
      // 获取区
      getAllCity('gettowon',res.data.city_id).then(res=>{
        if(res.status==200){
          that.setData({
            districtAll:res.data
          })
        }
      }).catch(err=>{
        app.Tips("请求失败，请稍后重试~")
      })
      // 获取县
      getAllCity('street',res.data.district_id).then(res=>{
        if(res.status==200){
          that.setData({
            countyAll:res.data
          })
        }
      }).catch(err=>{
        app.Tips("请求失败，请稍后重试~")
      })
    });
  },
  getWxAddress:function(){
    var that = this;
    wx.authorize({
      scope: 'scope.address',
      success: function (res) {
        wx.chooseAddress({
          success: function (res) {
            var addressP = {};
            addressP.province = res.provinceName;
            addressP.city = res.cityName;
            addressP.district = res.countyName;
            editAddress({
              address: addressP,
              is_default: 1,
              real_name: res.userName,
              post_code: res.postalCode,
              phone: res.telNumber,
              detail: res.detailInfo,
              id: 0,
              type: 1,
            }).then(res => {
              setTimeout(function () {
                if (that.data.cartId) {
                  var cartId = that.data.cartId;
                  var pinkId = that.data.pinkId;
                  var couponId = that.data.couponId;
                  that.setData({ cartId: '', pinkId: '', couponId: '' })
                  wx.navigateTo({
                    url: '/pages/order_confirm/index?cartId=' + cartId + '&addressId=' + (that.data.id ? that.data.id : res.data.id) + '&pinkId=' + pinkId + '&couponId=' + couponId
                  });
                } else {
                  wx.navigateBack({ delta: 1 });
                }
              }, 1000);
              return app.Tips({ title: "添加成功", icon: 'success' });
            }).catch(err => {
              return app.Tips({ title: err });
            });
          },
          fail: function (res) {
            if (res.errMsg == 'chooseAddress:cancel') return app.Tips({ title: '取消选择' });
          },
        })
      },
      fail: function (res) {
        wx.showModal({
          title: '您已拒绝导入微信地址权限',
          content: '是否进入权限管理，调整授权？',
          success(res) {
            if (res.confirm) {
              wx.openSetting({
                success: function (res) {
                  console.log(res.authSetting)
                }
              });
            } else if (res.cancel) {
              return app.Tips({ title: '已取消！' });
            }
          }
        })
      },
    })
  },
  /**
   * 提交用户添加地址
   * 
  */
  formSubmit:function(e){
    console.log(e)
    var that = this, value = e.detail.value;
    if (!value.real_name) return app.Tips({title:'请填写收货人姓名'});
    if (!value.phone) return app.Tips({title:'请填写联系电话'});
    if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(value.phone)) return app.Tips({title:'请输入正确的手机号码'});
    if (that.data.youAddress =='') return app.Tips({title:'请选择所在地区'});
    if (!value.detail) return app.Tips({title:'请填写详细地址'});
    value.id=that.data.id;
    value.address={
      province:that.data.province.name,
      province_id:that.data.province.id,
      city: that.data.city.name,
      city_id: that.data.city.id,
      district: that.data.district.name,
      district_id: that.data.district.id,
      stree:that.data.county.name,
      stree_id:that.data.county.id,
      // city_id: that.data.cityId,
    };
    value.is_default = that.data.userAddress.is_default ? 1 : 0;
    console.log(value)
    editAddress(value).then(res=>{
      if (that.data.id)
        app.Tips({ title: '修改成功', icon: 'success' });
      else
        app.Tips({ title: '添加成功', icon: 'success' });
      setTimeout(function () {
        if (that.data.cartId) {
          var cartId = that.data.cartId;
          var pinkId = that.data.pinkId;
          var couponId = that.data.couponId;
          that.setData({ cartId: '', pinkId: '', couponId: '' })
          wx.navigateTo({
            url: '/pages/order_confirm/index?cartId=' + cartId + '&addressId=' + (that.data.id ? that.data.id : res.data.id) + '&pinkId=' + pinkId + '&couponId=' + couponId
          });
        } else {
          wx.navigateBack({ delta: 1 });
        }
      }, 1000);
    }).catch(err=>{
      return app.Tips({title:err});
    })
  },
  ChangeIsDefault:function(e){
    this.setData({ 'userAddress.is_default': !this.data.userAddress.is_default});
  },

})