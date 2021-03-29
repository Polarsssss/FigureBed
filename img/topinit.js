//globalParam:gpm
//var config = new Object();
var base64 = new Base64();
var gpm = {
  cxtj: {}, //查询控件
  xh: {}, //下钻序号
  xz: {}, //标记下钻
  lastmodify: {}, //保存最后一次modifysql相关参数
  qcNeed:{},    //为了一些什么什么展开之类的存储最后一次modify相关参数
  xhOld: {}, //下钻序号: 为拼接where语句。
  sql: {}, //拼接的sql语句
  jcdm: {},
  hj: {}, //合计相关
  csh:{},//记录界面初始化
  zbdw:{},//制表单位
  zmCol:{}//转码配置
}; 
gpm.cxtj.str_where_xz = "";

var statusManager = {
  currentNum: parseInt(0),
  gpmArray: [""],
  tableArray: [""]
};

/**
* [getTableHtml description]
* @return {[type]} [description]
*/
function getTableHtml() {
  var $tableObj = $("#divcon17 table:first", window.frames["iframe_table"].document);
  var tableHtml = "";
  if ($tableObj) {
      tableHtml = $tableObj.html();
  }
  return tableHtml;
}

/**
* [recoverGpmAndHTML 恢复状态和表内容]
* @param {[type]} tableObj  [description]
* @param {[type]} tableHtml [description]
*/
function recoverGpmAndHTML(tableObj, tableHtml) {
 var $tableObj = $("#divcon17 table:first", window.frames["iframe_table"].document);

  var tableHtml = statusManager.tableArray[statusManager.currentNum];
  debugger;
  var tempGpm = $.extend(true, {}, gpm);
  gpm = copyGpm(statusManager.gpmArray[statusManager.currentNum]);
  if(tempGpm.cxtj.url==gpm.cxtj.url){
      if ($tableObj) {
          $tableObj.html(tableHtml);
          // Grid还原
          if(gpm.gridConfig) {
              //$tableObj.find('#table1').html('');
              setTimeout(function(){
                  $("iframe[id='iframe_table']")[0].contentWindow.reloadGrid(gpm.gridConfig);
              },50);
          }
      }
  }else{
      //window.frames["iframe_table"].location.href = gpm.cxtj.url;
      $('#iframe_table iframe').attr('src', gpm.cxtj.url);
  }
}


/**
* [recordGpmAndHTML 记录当前gpm和tableHTML]
* @param  {[type]} tableHtml [description]
* @return {[type]}           [description]
*/
function recordGpmAndHTML(tableHtml) {
  // statusManager.currentNum = parseInt(statusManager.currentNum);
  gpm.cxtj.url = $('iframe[id="iframe_table"]').attr('src');
  //gpm.cxtj.url = window.frames["iframe_table"].location.href;
  debugger;
  statusManager.gpmArray[statusManager.currentNum] = copyGpm(gpm);
  statusManager.tableArray[statusManager.currentNum] = tableHtml;
}

/**
* [copyGpm 复制gpm对象]
* @param  {[type]} gpm [description]
* @return {[type]}     [description]
*/
function copyGpm(gpm) {
  var newGpm = $.extend(true, {}, gpm);
  return newGpm;
}

/**
* [switchStatus 切换前进后退状态]
* 保存要回退的状态号
* 保存当前状态
* 根据stampNum切换：table和gpm
* @param  {[type]} num [-1后退，1前进]
* @return {[type]}     [description]
*/
function switchStatus(num) {
  debugger;
  statusManager.currentNum--;
  // * 保存要回退的状态号
  var stampNum = parseInt(statusManager.currentNum) + parseInt(num);
  // * 保存当前状态
  recordGpmAndHTML(getTableHtml());
  // * 回退：table和gpm
  statusManager.currentNum = parseInt(stampNum);
  recoverGpmAndHTML();
  setBFbtnDisabled();

 $("iframe[id='iframe_table']")[0].contentWindow.changeDataSourceSql();
}


/**
* [forwardStatus description]
* 记录当前状态
* 舍弃当前状态后的数据
* 状态++
* @param  {[type]} argument [description]
* @return {[type]}          [description]
*/
function forwardStatus(argument) {
  debugger;
  recordGpmAndHTML(getTableHtml());
  var discardLength = statusManager.gpmArray.length - (statusManager.currentNum + 1);
  // 舍弃当前状态后的数据
  statusManager.gpmArray.splice(statusManager.currentNum + 1, discardLength);
  statusManager.currentNum++;
  setBFbtnDisabled();

}
/**
* [setBFbtnDisabled 使前进后退是否可用]
*/

function setBFbtnDisabled() {
  var isBackDisabled = true;
  var isForwardDisabled = true;
  //如果当前
  if (statusManager.currentNum > 1 ) {
      isBackDisabled = false;
      $("#btn_fhcx").hide();
  }
  // if ((statusManager.currentNum > 0) && (statusManager.currentNum < statusManager.gpmArray.length - 1)) {
  if ((statusManager.currentNum == 1) && (statusManager.gpmArray.length > 1)) {
      isForwardDisabled = false;
      $("#btn_fhcx").show();
  }
  $("#btn_back").attr("disabled", isBackDisabled);
  if(isBackDisabled) $("#btn_back").addClass('back-dis'); else $("#btn_back").removeClass('back-dis');
  $("#btn_forward").attr("disabled", isForwardDisabled);
  if(isForwardDisabled) $("#btn_forward").addClass('prev-dis'); else $("#btn_forward").removeClass('prev-dis');
}

/**
* 改变扩展条件样式事件
*/
function controlLoadMore_dis() {
   if ($('#table_kztj').is(':hidden')) {
       $('#table_kztj').show();
       $("#btn_kztj").val("收起条件");
   } else {
       $('#table_kztj').hide();
       $("#btn_kztj").val("更多条件");
   }
}


/**
* 初始化下钻序号
*/
function initXzxh(){
  gpm.xh.ZGSWSKFJ_DM = (gpm.jcdm - 1 > 4) ? 4 : (gpm.jcdm - 1); //税务机关下钻初始序号
  if(gpm.zbdw.swjg_dm.substr(0,3)=="233"){
    gpm.xh.ZGSWSKFJ_DM = (gpm.jcdm - 1 > 5) ? 5 : (gpm.jcdm - 1); //税务机关下钻初始序号
  }
  gpm.xh.DJZCLX_DM = 0; //初始化下钻序号 
  gpm.xh.HYML_DM = 0; //初始化下钻序号
 /*  gpm.xh.JDXZ_DM = 0; //初始化下钻序号，除了上述三个字段其他都不需要下钻，仅仅为了于函数解耦
  gpm.xh.TDSFYYLX_DM = 0; //初始化下钻序号，除了上述三个字段其他都不需要下钻，仅仅为了于函数解耦
  gpm.xh.SSGLY_DM = 0; //初始化下钻序号，除了上述三个字段其他都不需要下钻，仅仅为了于函数解耦
*/  
  // 除了税务机关根据级次代码确定下钻序号外，其他需要下钻的均从 0 开始  
  for (var i = 0; i < array_dynamicClo.length; i++) {
      if(!isXz[array_dynamicClo[i]]){
          gpm.xh[array_dynamicClo[i]] = 0;
      }
  }
}
/**
*  日期输入检查
*/
function ckeckDate(){
var rq_q = "";
var rq_z = "";
var skssq_q ="";
var skssq_z = "";
if($("#datetimeq").length > 0){
  rq_q = $("#datetimeq").val().replace(/\-/g, "");
  if(rq_q == ''){
    alert("统计时间不能为空，请选择！");
    return false;
  }
}
if($("#datetimez").length > 0){
  rq_z = $("#datetimez").val().replace(/\-/g, "");
  if(rq_z == ''){
    alert("统计时间不能为空，请选择！");
    return false;
  }
}
if($("#skssqq").length > 0){
  skssq_q = $("#skssqq").val().replace(/\-/g, "");
}
if($("#skssqz").length > 0){
  skssq_z = $("#skssqz").val().replace(/\-/g, "");
}

if(rq_q > rq_z && rq_z != ''){
  alert("统计时间起不能大于统计时间止，请重新选择！");
  return false;
}
if(skssq_q > skssq_z && skssq_z != ''){
  alert("税款所属期起不能大于税款所属期止，请重新选择!");
  return false;
}
return true;
}

/**
* [checkInput 输入框非法输入字符检测]
* @return {[type]} [description]
*/
//非法字符数组，避免使用正则
var illegalChar = ['"','\'']
function checkInput(){
  var InputList = $('.input-text');
  for (var i = InputList.length - 1; i >= 0; i--) {
      var temp = $(InputList[i]).val();
      //使用jq封装的inArray
      if($.inArray(temp,illegalChar) > -1)return false;
  }
  return true;
}

/**
* 点击"查询"按钮的事件
*/
function  btn_query_click(){
  debugger;
  if(!ckeckDate()){
      return;
  }
  if(!checkInput()){
      alert('输入存在非法字符('+illegalChar.toString()+')，请重新输入');
      return;
  }
  statusManager = {
  currentNum: parseInt(0),
  gpmArray: [""],
  tableArray: [""]
};
  getSwjg();
 // forwardStatus();
  gpm.cxtj.str_where_xz = ""; // 清空下钻条件
  debugger;
  initXzxh();
  // 获取分组项目的数组
  //分组项目
  if($("#Idivcon_fzxm").length > 0){
    gpm.cxtj.fzxm = String(getIdivTreeValue("divcon_fzxm")).replace(/\'/g, "").split(",");
    if(gpm.cxtj.fzxm[0].trim() == "" ){
      alert("分组项目不能为空！");
      return;
    }
  }else{
    gpm.cxtj.fzxm = [];
  }

  setXzClickNum();

  // 获取选择的税务机关最大的级次代码
  modifyJcdm();
  
  if (!interface_getQueryCon()) {
      gpm.cxtj = {};
      return false;
  }
  
  var _url = "../../FileAccess.aspx?&FileName=" + url;
  //window.frames["iframe_table"].location.href = _url;
  $('#iframe_table iframe').attr('src',_url)
  $("#btn_cx").attr("disabled",true).val("查询中...");
}

function setXzClickNum(){
var fzxmArray = ($.isEmptyObject(gpm.cxtj.fzxm))?["ZGSWSKFJ_DM"]:gpm.cxtj.fzxm;
for (var i = 0; i < fzxmArray.length; i++) {
    gpm.xz[fzxmArray[i]] = 0;
}
}

/**
* 改变条件样式事件.返回查询条件按钮事件
*/
function controlLoad_dis() {
//switchStatus(-1);
$("#divcon_cxtj").show();
$('#divcon_option').hide();
$("#iframe_table").hide();
$('#lab_title').show();
$("#btn_cx").attr("disabled", false).val("查询");
/* if($("#btn_result").length<=0){
  var result_node = $("#btn_cx").clone();
  $(result_node).prop('id','btn_result')
                .val('返回结果')
                .off('click')
                .on('click',btn_back_result);
  $("#btn_cx").parent().append(result_node);
}*/


/*  statusManager = {
  currentNum: parseInt(0),
  gpmArray: [""],
  tableArray: [""]
};*/
// forwardStatus();
}
function btn_back_result(){
debugger;
//gpm = copyGpm(statusManager.gpmArray[statusManager.currentNum]);
// recordGpmAndHTML(getTableHtml());
//switchStatus(2);
$("#divcon_cxtj").hide();
$('#divcon_option').show();
$("#iframe_table").show();
$('#lab_title').hide();

}
//显示table以及各按钮
function displayTable(){
$("#divcon_cxtj").hide();
$("#iframe_table").show();
$('#divcon_option').show();
$('#lab_title').hide();
// setBFbtnDisabled();
// forwardStatus();
 if($("#btn_result").length<=0){
  var result_node = $("#btn_cz").clone();
  $(result_node).prop('id','btn_result')
                .val('返回结果')
                .off('click')
                .on('click',btn_back_result);
  $("#btn_cx").parent().append(result_node);
}
}


/* 初始化统计日期起
* @param  
* @return 
*/
function initDate() {
  if($("#datetimez").length == 0 || $("#datetimeq").length == 0){
    return;
  }
  var curdate = document.getElementById("datetimez").value;
  var date = document.getElementById("datetimeq");
  date.value = curdate.substr(0, 5) + "01";
}

var messenger = new Messenger('bb_frame', 'gljc');
function interface_para_init(){
debugger
//$("#btn_back").prop("outerHTML", "<button id='btn_back' class='dis' disabled='disabled' onclick='switchStatus(-1)'>后退</button>");
//$("#btn_forward").prop("outerHTML","<button id='btn_forward' class='dis' disabled='disabled' onclick='switchStatus(1)'>前进</button>");
 $("#table_kztj").hide();
 $('#divcon_option').hide();
 $('#btn_forward').click(function() { switchStatus(1); });
 $('#btn_back').click(function() { switchStatus(-1); });
  $('.btn-back,.btn-prev,.btn-fhcx,.btn-export,.btn-print').after('<div class="split"></div>');

initComponentsByAjax();//异步加载参数控件
   // getSwjg();
   // alert("interface_para_init");
var bwidth = $('body').width();
$('#divconA table').width(bwidth<800?'800px':bwidth+'px');
$('#divconA').width(bwidth).css('overflow','auto');
$("#divconA").find("iframe").attr({"id":"iframe_table"})
$('iframe[id="bb_frame"]').css({'margin-left':'17px'});
$("#lab_title").css({"margin-top":"147px","top":"0","display":"block"});
$("#table_tj").children("table").css({"height":"auto"});
$("#table_kztj").children("table").css({"height":"auto"});
$("#table_btn").children("table").css({"height":"auto"});
initComponentsByAjax();
$(window).resize(function(){
var width = $('body').width();
$('#divconA').width(width <800?'800px':width +'px');
$('#divconA table').width(width <800?'800px':width +'px');
})
//清册 跨域
messenger.listen(function (msg) {
      debugger;
      var data = JSON.parse(msg).data;
      //pdomain = data.pdomain;
      if(data.option==0){
        var dmmc = eval('('+data.dmmc+')');
        dmzmc =  dmmc;
      }else if(data.option == 'resCode'){
    nsrqc_export_qk(data.code);
  }
  });
  messenger.addTarget(window.parent, 'parent');
  setTimeout(function(){
    getDMMC();
   debugger
   if($.isEmptyObject(dmzmc)){
      initDmzmc();//异步加载需要转名称的代码表
   }
  },1);
}
function getDMMC(){
var cols ="";
for(var tm in gpm.zmCol){
  cols+= gpm.zmCol[tm]+',';

}
cols = cols.substr(0,cols.length-1);
if(cols==""||cols==null){
  return ;
}
var initdata = {
  option:3,//获取代码转名称标志
  dmmc:cols
}
call(initdata);


}
function sendMessage(name,msg) {
  var sendMsg = {
          "data" : msg
      };
  messenger.targets[name].send(JSON.stringify(sendMsg));
 
}
function call(data) {
  sendMessage("parent",data);
}
var pdomain = "";//获取查询框架端域地址
var dmzmc = {};//代码转名称装载数据的对象

/**
* 异步加载需要转名称的代码表
*/
// var dmzmcMap = {};
function initDmzmc(){
  // var surl = "Server/DataJson.aspx?conn="+dataSource+"&sql=";
  // alert("initDmzmc");
  debugger;
  //税务机关
  if(gpm.zmCol["ZGSWSKFJ_DM"]){
      var sql_swjg = "select swjg_dm dm,swjg_mc mc from j1_di.di_swjg ";
      getDmzmcObj(sql_swjg,gpm.zmCol["ZGSWSKFJ_DM"]);
  }
  //省级税务机关
  if(gpm.zmCol["SSSWJG_DM"]){
      var sql_swjg = "select swjg_dm dm,swjg_mc mc from j1_ygz.ygzsj_dm_gy_swjg ";
      getDmzmcObj(sql_swjg,gpm.zmCol["SSSWJG_DM"]);
  }

  // 行业
  if(gpm.zmCol["HYML_DM"]){
      var sql_hy = "select hy_dm dm,hy_mc mc, attr  from j1_di.v_hy";
      getDmzmcObj(sql_hy,gpm.zmCol["HYML_DM"]);
  }
  // 登记注册类型
  if(gpm.zmCol["DJZCLX_DM"]){
    var sql_djzclx = "select substr(djzclx_dm,0,3) dm,djzclx_mc mc from j1_dw_yh.v_djzclx ";
    getDmzmcObj(sql_djzclx,gpm.zmCol["DJZCLX_DM"]);
  }
    // 征收品目
  if(gpm.zmCol["ZSPM_DM"]){
    var sql_zspm = " select zspm_dm dm,zspm_mc mc from j1_di.di_zspm ";
    getDmzmcObj(sql_zspm,gpm.zmCol["ZSPM_DM"]);
  }
  // 征收项目
  if(gpm.zmCol["ZSXM_DM"]){
    var sql_zsxm = "select zsxm_dm dm,zsxm_mc mc from j1_di.di_zsxm";
    getDmzmcObj(sql_zsxm,gpm.zmCol["ZSXM_DM"]);
  }
  // 退抵税费类型
  if(gpm.zmCol["TDSFYYLX_DM"]){
    var sql_tdsfyylx = "SELECT dm_dm dm,dm_mc mc FROM j1_di.di_gy_1jdm WHERE dmlx_dm = 'DM_ZS_TDSFYYLX'";
    getDmzmcObj(sql_tdsfyylx,gpm.zmCol["TDSFYYLX_DM"]);
  }
  // 税收管理员
  if(gpm.zmCol["SSGLY_DM"]){
    var sql_swry = "SELECT swry_dm dm,swry_mc mc FROM j1_di.di_swry";
    getDmzmcObj(sql_swry,gpm.zmCol["SSGLY_DM"]);
  }
  // 街道乡镇
  if(gpm.zmCol["JDXZ_DM"]){
    // var sql_jdxz = "SELECT jdxz_dm dm,replace(jdxz_mc,chr(10),'') mc FROM j1_di.di_jdxz ";
    var sql_jdxz = "SELECT jdxz_dm dm,jdxz_mc mc FROM j1_di.di_jdxz ";
    getDmzmcObj(sql_jdxz,gpm.zmCol["JDXZ_DM"]);
  }
  // 纳税人状态
  if(gpm.zmCol["NSRZT_DM"]){
    var sql_nsrzt = "select dm_dm dm , dm_mc mc  from j1_di.di_gy_1jdm  where dmlx_dm = 'DM_GY_NSRZT' ";
    getDmzmcObj(sql_nsrzt,gpm.zmCol["NSRZT_DM"]);
  }
  // 课征主体类型、税务登记表类型
  if(gpm.zmCol["KZZTDJLX_DM"]){
    var sql_kzzt = "SELECT dm_dm dm,dm_mc mc FROM di_gy_1jdm WHERE dmlx_dm = 'DM_DJ_KZZTDJLX' ";
    getDmzmcObj(sql_kzzt,gpm.zmCol["KZZTDJLX_DM"]);
  }
  // 营改增纳税人类型
  if(gpm.zmCol["YGZNSRLX_DM"]){
    var sql_ygznsrlx = "select dm_dm dm , dm_mc mc  from j1_di.di_gy_1jdm  where dmlx_dm =  'DM_GY_YGZNSRLX' ";
    getDmzmcObj(sql_ygznsrlx,gpm.zmCol["YGZNSRLX_DM"]);
  }
  // (增值税)纳税人类型
  if(gpm.zmCol["NSRLX_DM"]){
    var sql_nsrlx = "SELECT zzsnsrlx_dm dm,zzsnsrlx_mc mc FROM j1_di.DI_ZZSNSRLX ";
    getDmzmcObj(sql_nsrlx,gpm.zmCol["NSRLX_DM"]);
  }
  // 预算科目
  if(gpm.zmCol["YSKM_DM"]){
    var sql_yskm = "SELECT yskm_dm dm ,yskm_mc mc FROM j1_di.di_yskm ";
    getDmzmcObj(sql_yskm,gpm.zmCol["YSKM_DM"]);
  }
  // 提退税金类型
  if(gpm.zmCol["TTSJLX_DM"]){
    var sql_ttsjlx = "SELECT dm_dm dm,dm_mc mc FROM j1_di.di_gy_1jdm WHERE dmlx_dm = 'DM_ZS_TTSFLX'";
    getDmzmcObj(sql_ttsjlx,gpm.zmCol["TTSJLX_DM"]);
  }
  // 发票种类
  if(gpm.zmCol["FPZL_DM"]){
    var sql_fpzl = "SELECT dm_dm dm,dm_mc mc FROM j1_di.di_gy_1jdm WHERE dmlx_dm = 'DM_FP_FPZL'";
    getDmzmcObj(sql_fpzl,gpm.zmCol["FPZL_DM"]);
  }
  // 发票类别
  if(gpm.zmCol["FPLB_DM"]){
    var sql_fplb = "SELECT dm_dm dm,dm_mc mc FROM j1_di.di_gy_1jdm WHERE dmlx_dm = 'DM_FP_FPLB'";
    getDmzmcObj(sql_fplb,gpm.zmCol["FPLB_DM"]);
  }
  // 总分机构类型
  if(gpm.zmCol["ZFJGLX_DM"]){
    var sql_zfjglx = "SELECT dm_dm dm,dm_mc mc FROM j1_di.di_gy_1jdm WHERE dmlx_dm = 'DM_DJ_ZFJGLX'";
    getDmzmcObj(sql_zfjglx,gpm.zmCol["ZFJGLX_DM"]);
  }
  // 核算方式
  if(gpm.zmCol["HSFS_DM"]){
    var sql_hsfs = "SELECT dm_dm dm,dm_mc mc FROM j1_di.di_gy_1jdm WHERE dmlx_dm = 'DM_GY_HSFS'";
    getDmzmcObj(sql_hsfs,gpm.zmCol["HSFS_DM"]);
  }
  // 身份证件类型
  if(gpm.zmCol["FDDBRSFZJLX_DM"]){
    var sql_sfzjlx = "SELECT dm_dm dm,dm_mc mc FROM j1_di.di_gy_1jdm WHERE dmlx_dm = 'DM_GY_SFZJLX'";
    getDmzmcObj(sql_sfzjlx,gpm.zmCol["FDDBRSFZJLX_DM"]);
  }
  // 隶属关系
  if(gpm.zmCol["DWLSGX_DM"]){
    var sql_lsgx = "SELECT dm_dm dm,dm_mc mc FROM j1_di.di_gy_1jdm WHERE dmlx_dm = 'DM_GY_DWLSGX'";
    getDmzmcObj(sql_lsgx,gpm.zmCol["DWLSGX_DM"]);
  }
  // 收款国库
  if(gpm.zmCol["SKGK_DM"]){
    var sql_skgk = "select SKGK_DM dm,skgkmc mc from j1_di.di_gk where xybz = 'Y' and yxbz = 'Y' ";
    getDmzmcObj(sql_skgk,gpm.zmCol["SKGK_DM"]);
  }
  // 国库
  if(gpm.zmCol["GK_DM"]){
    var sql_gk = "select GK_DM dm,skgkmc mc from j1_di.di_gk where xybz = 'Y' and yxbz = 'Y' ";
    getDmzmcObj(sql_gk,gpm.zmCol["GK_DM"]);
  }
  // 税收违法手段
  if(gpm.zmCol["SSWFSD_DM"]){
    var sql_wfsd = "SELECT dm_dm dm,dm_mc mc FROM j1_di.di_gy_1jdm WHERE dmlx_dm = 'DM_GY_SSWFSD'";
    getDmzmcObj(sql_wfsd,gpm.zmCol["SSWFSD_DM"]);
  }
  // 违法类型
  if(gpm.zmCol["SSWFLX_DM"]){
    var sql_wflx = "SELECT dm_dm dm,dm_mc mc FROM j1_di.di_gy_1jdm WHERE dmlx_dm = 'DM_GY_SSWFLX'";
    getDmzmcObj(sql_wflx,gpm.zmCol["SSWFLX_DM"]);
  }
  // 国有控股类型
  if(gpm.zmCol["GYKGLX_DM"]){
    var sql_wflx = "SELECT dm_dm dm,dm_mc mc FROM j1_di.di_gy_1jdm WHERE dmlx_dm = 'DM_GY_GYKGLX'";
    getDmzmcObj(sql_wflx,gpm.zmCol["GYKGLX_DM"]);
  }
  // 批准设立机构类型
  if(gpm.zmCol["PZSLJGLX_DM"]){
    var sql_wflx = "SELECT dm_dm dm,dm_mc mc FROM j1_di.di_gy_1jdm WHERE dmlx_dm = 'DM_DJ_PZSLJGLX'";
    getDmzmcObj(sql_wflx,gpm.zmCol["PZSLJGLX_DM"]);
  }
  // 组织机构代码
  if(gpm.zmCol["ZZJGLX_DM"]){
    var sql_wflx = "SELECT dm_dm dm,dm_mc mc FROM j1_di.di_gy_1jdm WHERE dmlx_dm = 'DM_GY_ZZJGLX'";
    getDmzmcObj(sql_wflx,gpm.zmCol["ZZJGLX_DM"]);
  }
  // 办证方式
  if(gpm.zmCol["BZFS_DM"]){
    var sql_wflx = "SELECT dm_dm dm,dm_mc mc FROM j1_di.di_gy_1jdm WHERE dmlx_dm = 'DM_DJ_SWDJBZFS'";
    getDmzmcObj(sql_wflx,gpm.zmCol["BZFS_DM"]);
  }
  // 适用会计制度、会计制度准则
  if(gpm.zmCol["KJZDZZ_DM"]){
    var sql_wflx = "SELECT dm_dm dm,dm_mc mc FROM j1_di.di_gy_1jdm WHERE dmlx_dm = 'DM_GY_KJZDZZ'";
    getDmzmcObj(sql_wflx,gpm.zmCol["KJZDZZ_DM"]);
  }
  // 国地管户类型
  if(gpm.zmCol["GDGHLX_DM"]){
    var sql_wflx = "SELECT dm_dm dm,dm_mc mc FROM j1_di.di_gy_1jdm WHERE dmlx_dm = 'DM_DJ_GDGHLX'";
    getDmzmcObj(sql_wflx,gpm.zmCol["GDGHLX_DM"]);
  }
  // 申报表类型
  if(gpm.zmCol["SBBLX_DM"]){
    var sql_wflx = "SELECT sbblx_dm dm,sbblx_mc MC FROM v_di_sbblx";
    getDmzmcObj(sql_wflx,gpm.zmCol["SBBLX_DM"]);
  }
  // 证照、执照类型
  if(gpm.zmCol["ZZLX_DM"]){
    var sql_wflx = "SELECT dm_dm dm,dm_mc mc FROM j1_di.di_gy_1jdm WHERE dmlx_dm = 'DM_GY_ZZLX'";
    getDmzmcObj(sql_wflx,gpm.zmCol["ZZLX_DM"]);
  }
  //产业
  if(gpm.zmCol["CY_DM"]){
        var sql_hsfs = "  select distinct(CY_DM) dm,CY_MC mc from j1_di.di_hy where xybz = 'Y' and yxbz = 'Y' ";
        getDmzmcObj(sql_hsfs,gpm.zmCol["CY_DM"]);
  }
  //区域
  if(gpm.zmCol["QYDM"]){
        var sql_hsfs = " select QYDM dm,QYMC mc from j1_di.di_qylx ";
        getDmzmcObj(sql_hsfs,gpm.zmCol["QYDM"]);
  }
  //税款属性
  if(gpm.zmCol["SKSX_DM"]){
        var sql_hsfs = "  select DM_DM dm,DM_MC mc from j1_di.di_sksx where xybz = 'Y' and yxbz = 'Y' ";
        getDmzmcObj(sql_hsfs,gpm.zmCol["SKSX_DM"]);
  }
  //税款种类
  if(gpm.zmCol["SKZL_DM"]){
        var sql_hsfs = "  SELECT DM_DM dm,DM_MC mc from j1_di.di_gy_1jdm WHERE dmlx_dm = 'DM_ZS_SKZL' ";
        getDmzmcObj(sql_hsfs,gpm.zmCol["SKZL_DM"]);
  }
  //直管县
  if(gpm.zmCol["ZGX_DM"]){
        var sql_hsfs = "  select ZGX_DM dm,ZGX_MC mc from DM0_ZGX_PZB where yxbz = 'Y' ";
        getDmzmcObj(sql_hsfs,gpm.zmCol["ZGX_DM"]);
  }
  // 减免性质、大类、小类
  if(gpm.zmCol["JMXZ_DM"]){
    var sql_wflx = " SELECT DM_DM DM,DM_MC MC FROM J1_DI.di_gy_1jdm WHERE dmlx_dm LIKE 'DM_GY_SSJMXZ%'  ";
    getDmzmcObj(sql_wflx,gpm.zmCol["JMXZ_DM"]);
  }
  // 国家或地区
  if(gpm.zmCol["GJHDQ_DM"]){
    var sql_gjhdq = " SELECT DM_DM DM,DM_MC MC FROM J1_DI.di_gy_1jdm WHERE dmlx_dm = 'DM_GY_GJHDQ'  ";
    getDmzmcObj(sql_gjhdq,gpm.zmCol["GJHDQ_DM"]);
  }
  // 国别
  if(gpm.zmCol["GB_DM"]){
    var sql_gjhdq = " select GJHDQSZ_DM DM,GJHDQMC MC from j1_ygz.zzsgg_dm_gjhdq ";
    getDmzmcObj(sql_gjhdq,gpm.zmCol["GB_DM"]);
  }

  // 征收方式
  if(gpm.zmCol["ZSFS_DM"]){
    var sql_gjhdq = " SELECT DM_DM DM,DM_MC MC FROM J1_DI.di_gy_1jdm WHERE dmlx_dm = 'DM_GY_ZSFS'  ";
    getDmzmcObj(sql_gjhdq,gpm.zmCol["ZSFS_DM"]);
  }
  // 重点税源级次、省、市级次
  if(gpm.zmCol["ZDSYHJKJC_DM"]){
    var sql_gjhdq = " SELECT DM_DM DM,DM_MC MC FROM J1_DI.DI_DM_GLJC_ZDSYHJB  ";
    getDmzmcObj(sql_gjhdq,gpm.zmCol["ZDSYHJKJC_DM"]);
  }
  // 经营方式
  if(gpm.zmCol["JYFS_DM"]){
    var sql_gjhdq = " SELECT DM_DM DM,DM_MC MC FROM J1_DI.di_gy_1jdm WHERE dmlx_dm = 'DM_ZS_JYFS'  ";
    getDmzmcObj(sql_gjhdq,gpm.zmCol["JYFS_DM"]);
  }
  // 审批人
  if(gpm.zmCol["ZSR_DM"]){
    var sql_zsr = "SELECT swry_dm dm,swry_mc mc FROM j1_di.di_swry";
    getDmzmcObj(sql_zsr,gpm.zmCol["ZSR_DM"]);
  }
  // 纳税人类型
  if(gpm.zmCol["NSRLX_DM"]){
    var sql_zsr = "SELECT nsrlx_dm dm,nsrlx_mc mc FROM j1_di.di_nsrlx";
    getDmzmcObj(sql_zsr,gpm.zmCol["NSRLX_DM"]);
  }
  // 专票票种
  if(gpm.zmCol["ZPPZ_DM"]){
    var sql_zsr = "SELECT dm_dm dm,dm_mc mc FROM j1_di.di_dm_fp_zppz";
    getDmzmcObj(sql_zsr,gpm.zmCol["ZPPZ_DM"]);
  }


}

/**
* 获取代码转名称的对象
* @param  {[type]} sql [description]
* @param  {[type]} key [description]
* @return {[type]}     [description]
*/
function getDmzmcObj(sql,key){
  var surl = "Server/DataJson.aspx?base64"
  var params = "conn="+dataSource+"&sql="+sql+"&dtype=json"
  surl += base64.encode(params);
  $.ajax({
      type:"post",
      url:surl,
      dataType:"text",
      success:function(jsnData){
          dmzmc[key]={};
          debugger;
          try{
            var dmzmctmpArray = eval("(" +jsnData+")");
          }catch(e){
            dmzmc[key]={};
            alert(key+"转码数据未成功解析！");
            return;
          }
          for (var i = 0; i < dmzmctmpArray.length; i++) {
              dmzmc[key][dmzmctmpArray[i].DM] = dmzmctmpArray[i].MC;
          }
      }
  });
}


/**
* 根据门户的权限税务机关获取税务机关中文名称
* @return {[type]} [description]
*/
function getSwjg(){
debugger;
  gpm.zbdw.swjg_mc = "";
  if(dmzmc.swjg&&dmzmc.swjg[gpm.zbdw.swjg_dm]){
      gpm.zbdw.swjg_mc = dmzmc.swjg[gpm.zbdw.swjg_dm];
  }
}
/**
* 导出excel
*/
function exportExcel(){
debugger;
  /*layer.open({
    title:'选择导出方式',
    btn: ['导出当页', '导出全部']
    ,btnAlign: 'c'
    ,btn1: function(index, layero){
       debugger;
       layer.close(index);  
       //xlspage('btn8',-2);
       window.frames["iframe_table"].window.exeExport(1);
      // window.frames["iframe_table"].document.getElementById("excel_btn").click();
       
    }
    ,btn2: function(index, layero){
      debugger;
      layer.closeAll();
      //xlspage('btn8',1);    
            
      window.frames["iframe_table"].window.exeExport(-2);       
      //window.frames["iframe_table"].document.getElementById("excel_btn").click();
    }
     ,cancel: function(){ 
      //右上角关闭回调
      
      //return false 开启该代码可禁止点击该按钮关闭
    }
  });*/
  $("iframe[id='iframe_table']")[0].contentWindow.exeExport();
}

function btn_print(){
$("iframe[id='iframe_table']").contents().find('#btn_print').click();
}

function btn_help(){
var help_url = url.substr(0,url.lastIndexOf('/'))+'/help.html';
var path = '../../../Resource//project/';
var common = 'reports/adp/common/help.html';
var xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
  xmlHttp.open("GET",path+help_url,false);
  xmlHttp.send();
  if (xmlHttp.readyState==4) {
    if(xmlHttp.status==404){
      help_url = common;
    }
  }
layer.open({
      title:'帮助信息'
      ,type: 2        
      ,area: ['700px', '450px']
      ,fixed: false //不固定
       ,maxmin: true
      ,offset: 'ct'
      ,id: 'help' 
      ,content: path +help_url
      ,btn: '关闭'
      ,btnAlign: 'c' 
      ,shade: 0.2 
      ,yes: function(){
        layer.closeAll();
      }
    });

}

// ctrl + shift 键 控制显示及隐藏 sql 框
window.onload = function() {  
debugger;
  //获取键盘事件
  var oHtml = document.getElementsByTagName("html")[0];  
  oHtml.onkeydown = function(ev) {  
      var e=ev||event;  
      /*===注释掉  
      if(window.event){  
          window.event.returnValue=false;  
      }else{  
          e.preventDefault();  
      }  
      */  
      var ctrlKey = e.ctrlKey || e.metaKey;//这里如果是检测shift键和其他键的话，就写e.shiftKey 
      debugger; 
      if(ctrlKey && e.keyCode == 16) {  
        debugger
          if($('#topsql').length <= 0){
              $("#divcon_cxtj").after("<TEXTAREA id=topsql class=dis></TEXTAREA>");
          }
          $('#topsql').html(gpm.sql.main||'');
          $('#topsql').toggle();
      }  

  }  
}
function getfpdjson2(strsql, strconn) {
  var a = LoadXml(pdfobj.strDataSource);
  if (strconn == null) {
      strconn = a.getAttribute("TypeIn")
  }
  var xml = "";
  var sql = escape(strsql).replace(/\+/g, "%252B");
  $.ajax({
      type: "POST",
      url: "Server/DataJson.aspx",
      async: false,
      data: {
          conn: escape(strconn),
          sql: sql,
          dtype: 'json',
          t: Math.random()
      },
      success: function (data) {
          xml = data;
      }
  });
  return eval("(" + xml + ")");
}
function nsrqc_dc_sql(){
  var xsnr="'"+gpm.cxtj.xsnr+"'";
  //表体SQL
  var showCol="djxh,nsrsbh,nsrmc,swjg_mc,zfjgbz,djzclx_mc,myqybz,gbhy_mc,zhhy_mc,zzsnsrlx,zgswskfj_dm,zgswskfj_mc,swryxm,zcmc";
  var str_sql = "select A.djxh,A.nsrsbh,A.nsrmc,"
  +"B.swjg_mc swjg_mc,"
  +" decode(A.zfjgbz,'0','总机构','1','分支机构') zfjgbz,"
  +" A.djzclx_mc,A.myqybz,A.gbhy_mc,A.zhhy_mc,"
  +" decode(A.zzsnsrlx,'01','深化增值税改革一般纳税人','02','其他一般纳税人','03','小规模纳税人','99','其他') zzsnsrlx,"
  +"A.ZGSWSKFJ_DM,E.SWJG_MC ZGSWSKFJ_MC,"
  +"D.SWRYXM,"
  +" A.zcmc,"
  if(xsnr.indexOf("yhtk")>-1){
      str_sql+="A.yhtk,";
      showCol+=",yhtk";
  }
  if(xsnr.indexOf("jmxmmc")>-1){
      str_sql+="A.jmxmmc,";
      showCol+=",jmxmmc";
  }
  showCol+=",zsxm_mc,jmxz_dm";
  str_sql+="A.zsxm_mc,A.jmxz_dm,";
  if(xsnr.indexOf("skssqq")>-1){
      str_sql+="to_char(A.skssqq,'yyyy/mm/dd') skssqq,";
      showCol+=",skssqq";
  }
  if(xsnr.indexOf("skssqz")>-1){
      str_sql+="to_char(A.skssqz,'yyyy/mm/dd') skssqz,";
      showCol+=",skssqz";
  }
  showCol+=",jmse,sdsjmbs";
  str_sql+="A.jmse,"
  +" decode(sdsjmbs,'01','自行享受','02','分摊减免','03','扣缴申报') sdsjmbs"
  +" from j1_sgs.JSJF_ALL_NSRQC_2020 A,j1_di.di_swjg B,"
  +"(SELECT distinct zcbm,'' jmxz_dm,qsyf,zzyf,'' sjhf,'' zdlbzc_dm  FROM j1_sgs.dm_jsjf_zcbm_2020 "
  +" UNION ALL SELECT '022019001303' zcbm,'0001042807' jmxz_dm,'202001' QSYF,'999912' ZZYF, '' SJHF,'' ZDLBZC_DM FROM dual "
  +" UNION ALL SELECT zcbm,jmxz_dm,qsyf,zzyf,sjhf,zdlbzc_dm  FROM J1_SGS.DM_JSJF_ZCBM_JMXZ_2020 where qsyf<='"+gpm.cxtj.tjqj+"' and zzyf >='"+gpm.cxtj.tjqj+"') C,"
  +" j1_tgq.DM_GY_SWRY D ,j1_di.di_swjg E    "
  +" where A.zgswj_dm =B.Swjg_Dm(+) and A.ZCBM=C.ZCBM AND nvl(A.JMXZ_DM,0) = nvl(C.JMXZ_DM,0)"
  +" and A.SSGLY_DM=D.SWRY_DM(+)  and A.Zgswskfj_Dm=E.SWJG_DM(+) "+gpm.cxtj.str_where
  +" order by djxh";
  var hj_sql="select sum(jmse) HZJE from ("+ str_sql+")";
  var hzje=getfpdjson2(hj_sql,"j1_sjbb");
  //表头内容
  headerArr=[
      "减税降费纳税人清册|统计期：" + gpm.cxtj.btsj + " |一、纳税人基本信息|纳税人电子档案号（登记序号）|合计",
  "减税降费纳税人清册|统计期：" + gpm.cxtj.btsj + " |一、纳税人基本信息|纳税人识别号|合计",
  "减税降费纳税人清册|统计期：" + gpm.cxtj.btsj + " |一、纳税人基本信息|纳税人名称|合计",
  "减税降费纳税人清册|统计期：" + gpm.cxtj.btsj + " |一、纳税人基本信息|主管税务机关|合计",
  "减税降费纳税人清册|统计期：" + gpm.cxtj.btsj + " |一、纳税人基本信息|总分机构标识|合计",
  "减税降费纳税人清册|统计期：" + gpm.cxtj.btsj + " |一、纳税人基本信息|登记注册类型|合计",
  "减税降费纳税人清册|统计期：" + gpm.cxtj.btsj + " |一、纳税人基本信息|民营企业|合计",
  "减税降费纳税人清册|统计期：" + gpm.cxtj.btsj + " |一、纳税人基本信息|国标行业名称|合计",
  "减税降费纳税人清册|统计期：" + gpm.cxtj.btsj + " |一、纳税人基本信息|综合行业名称|合计",
  "减税降费纳税人清册|统计期：" + gpm.cxtj.btsj + " |一、纳税人基本信息|增值税纳税人类型|合计",
  "减税降费纳税人清册|统计期：" + gpm.cxtj.btsj + " |一、纳税人基本信息|主管税务所科分局代码|合计",
  "减税降费纳税人清册|统计期：" + gpm.cxtj.btsj + " |一、纳税人基本信息|主管税务所科分局名称|合计",
  "减税降费纳税人清册|统计期：" + gpm.cxtj.btsj + " |一、纳税人基本信息|税收管理员名称|合计",
  "减税降费纳税人清册|统计期：" + gpm.cxtj.btsj + " |二、减税降费情况|减免政策名称|合计"
];   
if(xsnr.indexOf("yhtk")>-1){
  headerArr.push("减税降费纳税人清册|统计期：" + gpm.cxtj.btsj + " |二、减税降费情况|优惠条款|合计");
}
if(xsnr.indexOf("jmxmmc")>-1){
  headerArr.push("减税降费纳税人清册|统计期：" + gpm.cxtj.btsj + " |二、减税降费情况|减免项目名称|合计");
}

headerArr.push("减税降费纳税人清册|统计期：" + gpm.cxtj.btsj + " |二、减税降费情况|税（费）种类|合计",
"减税降费纳税人清册|统计期：" + gpm.cxtj.btsj + " |二、减税降费情况|减免性质代码|合计");
if(xsnr.indexOf("skssqq")>-1){
  headerArr.push("减税降费纳税人清册|统计期：" + gpm.cxtj.btsj + " |二、减税降费情况|有效期起|合计");
}
 if(xsnr.indexOf("skssqz")>-1){
  headerArr.push("减税降费纳税人清册|统计期：" + gpm.cxtj.btsj + " |二、减税降费情况|有效期止|合计");
}
headerArr.push(
 "减税降费纳税人清册|统计期：" + gpm.cxtj.btsj+ " |二、减税降费情况|减免金额|"+hzje[0]['HZJE'],
 "减税降费纳税人清册|统计期：" + gpm.cxtj.btsj+ " |二、减税降费情况|所得税减免标识|--");
  var xsnrArr=gpm.cxtj.xsnr.split(',');
  var xsnrLen=xsnrArr.length;
  var fl=xsnrLen+17;
  var merge_info=['0-0:0-'+fl,'1-1:0-'+fl,'2-2:0-12','2-2:13-'+fl,'4-4:0-'+(15+xsnrLen)];
  str_sql=str_sql.replace(/>/g, '&gt;').replace(/</g, '&lt;');
debugger;
var data = {
  "option" : "dcJfjsNsrqc2020",
  "str_sql" : str_sql,
      "xsnr" : xsnr,
      "headArr":headerArr,
      "merge_info":merge_info,
      "nd":"2020",
      "maxcount":"5000",
      "showCol":showCol
};
sendMessage('parent', data);
}

function show_download_list(){
debugger;
var pop_url = "../../FileAccess.aspx?&FileName=/reports/sgs/xwqy/2020njszctjhs/sj/fh_1jsjfnsrqc9020（dh）/download.fpd"
      + "&ParamPair=dataSource==zgzl"
      + "@@swry_dm==" + gpm.cxtj.swry_dm
                                  + "@@swry_mc==" + gpm.cxtj.swry_mc;
      layer.open({
          id: "iframe_xz",
          title : '下载',
          type : 2,
          content: pop_url,
          area: ['800px', '300px'],
          cancel: function(){},
          success: function(layero, index){}
      });
}

function nsrqc_export_qk(code){
if(code == '2001'){
  alert('导出异常，请重新导出！~');
}else if(code == '2000'){
  alert('导出成功，可点击下载列表选择下载！~')
}else if(code == '2002'){
  alert('查询无数据！~');
}else{
  alert('数据量过大，请选择后台导出！~');
}
$("#btn_exp_qc").attr("disabled", false);
}

/**
* 获取数据加工信息
*/
function getSjjgInfo(gnmk_dm, datetime, bz) {
  gpm.zbdw.jgsj = "<div></div>";
  var sql_kz = "select case " +
      "           when (" + datetime + ") = " +
      "                to_char(add_months(sysdate, jg_ssyf), 'yyyymm') then " +
      "            'Y' " +
      "           else " +
      "            'N' " +
      "         end kzbz " +
      "    from j1_zks.sjjg_pz_bbzl_gnmk " +
      "   where gnmk_dm = '" + gnmk_dm + "' " +
      "     and sjjg_tskg = 1 ";

  // 季报
  if (bz == "J") {
      var year = datetime.substring(0, 4);
      var jd = datetime.substr(5, 1);
      sql_kz = "select case " +
          "        when t.jd = to_char(sysdate, 'yyyymm') then " +
          "         'Y' " +
          "        else " +
          "         'N' " +
          "      end kzbz " +
          " from (select case " +
          "              when " + jd + " = 1 then " + year + " || substr(jg_jd, 0, 2) " +
          "              when " + jd + " = 2 then " + year + " || substr(jg_jd, 4, 2) " +
          "              when " + jd + " = 3 then " + year + " || substr(jg_jd, 7, 2) " +
          "                else " + parseInt(year) + 1 + " ||substr(jg_jd, 10, 2) " +
          "              end jd " +
          "         from j1_zks.sjjg_pz_bbzl_gnmk " +
          "        where gnmk_dm = '" + gnmk_dm + "' " +
          "          and sjjg_tskg = 1) t";
  }

  // 年报
  if (bz == "N") {
      sql_kz = "select case" +
          "         when to_char(sysdate, 'yyyymm') = " + datetime + " || jg_nd then" +
          "          'Y' " +
          "         else" +
          "          'N' " +
          "       end kzbz" +
          "  from j1_zks.sjjg_pz_bbzl_gnmk" +
          " where gnmk_dm = '" + gnmk_dm + "'" +
          "   and sjjg_tskg = 1";
  }

  // 所属期
  var obj_kz = getfpdjson(sql_kz, "zgzl");

  // 数据加工提示开关开启并且选择时间等于所属期，才进行数据加工信息展示
  if (obj_kz.length>0&& obj_kz[0].KZBZ == 'Y') {
      var sql_info = "select PCH, JGZT,JGSJ,msg from(" +
          "select PCH," +
          "       Z_ZT JGZT," +
          "       TO_CHAR(JSSJ, 'yyyy-MM-dd hh:mm') JGSJ," +
          "       case" +
          "         when kssj > zqrq then" +
          "          '0'" +
          "         else" +
          "          '1'" +
          "       end as msg" +
          "  from j1_zks.sjjg_rw_info info, J1_CXBB.CXBB_JZXGM_ZQRQ zq" +
          " where bbzl_dm = (select bbzl_dm" +
          "                    from j1_zks.sjjg_pz_bbzl_gnmk" +
          "                   where gnmk_dm = '" + gnmk_dm + "')" +
          "   and kssj is not null" +
          "   and to_char(kssj, 'yyyymm') = to_char(sysdate, 'yyyymm')" +
          "   and zq.ssyf = to_char(sysdate, 'yyyymm')" +
          " order by kssj desc)" +
          "   where rownum = 1";
      // 数据加工具体信息
      var obj_info = getfpdjson(sql_info, "zgzl");
      if (obj_info.length <= 0) {
          return true;
      }

      // 加工状态：1 进行中，2 完成，3 失败
      var jgzt = obj_info[0].JGZT;

      if (jgzt == 1) {
          alert("数据正在加工中！");
          return false;
      } else if (jgzt == 3) {
          alert("加工失败，工作流已挂起！");
          return false;
      } else {
          gpm.zbdw.jgsj = "数据加工时间：" + obj_info[0].JGSJ;
          if (obj_info[0].MSG == "1") {
              gpm.zbdw.jgsj += "（此为预产数据，仅供预审参考）";
          }
          return true;
      }
  }
  return true;
}