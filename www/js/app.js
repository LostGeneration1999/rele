appKey ="559f0a87bdfcbe69e64dd6061cb1c4dfc7e6cf692c0718ce1c62943f2f35dd6c";
clientKey = "756af48a935516e83f98290404b3e05bcf4eee08a2f5413727e9d427cbe533a6";
var ncmb = new NCMB(appKey, clientKey);
 
//外部ファイルからの取得
var xhr=null;
if (window.XMLHttpRequest)xhr=new XMLHttpRequest();
else if(window.ActiveXObject)
    try {xhr=new ActiveXObject("Msxml2.XMLHTTP");}
    catch(e){xhr=new ActiveXObject("Microsoft.XMLHTTP");}

xhr.open("GET","js/tag.js",false);
xhr.send("");
eval(xhr.responseText);

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
}

//***********　初期定数　**************//
//グローバル変数の定義
var search_count = 0;

//検索取得個数
const n = 6;
const parts_first_tags = [];
const parts_second_tags = [];
//延滞しているレンタルがあるか否か
var Do_you_rental_delay = false;
var rental_term = 13;

$(document).on('click', 'a.anchor', function(e){
  e.preventDefault();
  var y = $($(this).attr('href')).offset().top;
  $.mobile.silentScroll(y);
});

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    console.log(navigator.notification);
}
function alertDismissed() {
    // do something
}



//***********　タグ関数　*********************************************//
//タグ整理関数
function setTag(results,tag){
  //タグ整理
    if(tag === "SecondTag"){
      for(i=0;i<results.length;i++){
         var second_obj = {name: results[i].name,category_name: results[i].category_name,class: results[i].class,photo_name:results[i].photo_name};
         parts_second_tags.push(second_obj);
         }
    }else if(tag === "FirstTag"){
      for(i=0;i<results.length;i++){
        var first_obj = {name: results[i].name,category_name: results[i].category_name};
        parts_first_tags.push(first_obj);
       }
  }else{navigator.notification.alert("管理者までお知らせください");}
}

//タグ取得関数
function getTag(tag){
    var SaveParts = ncmb.DataStore(tag);

    //データを降順で取得します
    //必要なデータだけを取得できるようにする
    SaveParts.order("createDate",false)
            .fetchAll()
            .then(function(results){
                setTag(results,tag);
              })
              .catch(function(error){
                console.log("タグの全件検索に失敗しました: " +error);
              })
}

//セレクトボックス関数
function get_selected_box(form,selected){
  const num = document.form.selected.selectedIndex;
  const number = document.form.selected.options[num].value;
  return number;
}

//個数のセレクト関数に関するコード
function show_select_box(Select_Id,default_value){
  $(Select_Id).empty();
  isSelected =  (-1 === default_value);
  $(Select_Id).append($("<option>").val(-1).prop('selected', isSelected).text("個数を選んでください"));
  if(default_value === -1){
  for(i=0;i<11;i++){
    $(Select_Id).append($("<option>").val(`${i}`).text(`${i}`));
  }
  }else{
    for(i=0;i<11;i++){
    isSelected =  (i === default_value);
    $(Select_Id).append($("<option>").val(`${i}`).prop('selected', isSelected).text(`${i}`)).selectmenu().selectmenu("refresh",true);
  }
}
}

//Firstタグの情報をデータベースから取得
function show_first_tag(Select_Id,default_value){
  $(Select_Id).empty();
  isSelected =  ("main" === default_value);
  $(Select_Id).append($("<option>").val("main").prop('selected', isSelected).text("Firstタグを選んでください"));
  if(default_value === "main"){
  for(i=0;i<parts_first_tags.length;i++){
    $(Select_Id).append($("<option>").val(`${parts_first_tags[i].category_name}`).attr('class',parts_first_tags[i].category_name).text(`${parts_first_tags[i].name}`));
    }
  }else{
  for(i=0;i<parts_first_tags.length;i++){
    isSelected =  (parts_first_tags[i].category_name === default_value);
    $(Select_Id).append($("<option>").val(`${parts_first_tags[i].category_name}`).attr('class',parts_first_tags[i].category_name).prop('selected', isSelected).text(`${parts_first_tags[i].name}`)).selectmenu().selectmenu("refresh",true);
  }
 }
}

// *************Second Tag の表示 **************登録時
//Secondタグの情報をデータベースから取得　登録時
function show_second_tag(Select_Id,default_value){
  $(Select_Id).empty();
  isSelected =  ("main" === default_value);
  $(Select_Id).append($("<option>").val("main").prop('selected', isSelected).text("Secondタグを選んでください"));
  for(i=0;i<parts_second_tags.length;i++){
    isSelected =  (parts_second_tags[i].category_name === default_value);
    $(Select_Id).append($("<option>").val(`${parts_second_tags[i].category_name}`).prop('selected', isSelected).attr('class',parts_second_tags[i].class).text(`${parts_second_tags[i].name}`));
  }
}

//タグの調整　登録時
$(function() {
  $('select[name="parts_register_first_tag"]').change(function() {

    var firstTag = $('select[name="parts_register_first_tag"] option:selected').attr("class");
    var count = parts_second_tags.length;

    $('select[name="parts_register_second_tag"]').empty();
    for (var i=0;i<count;i++){
      var secondTag = parts_second_tags[i];
      if(parts_second_tags[i].class === firstTag){
				$('select[name="parts_register_second_tag"]').append($("<option>").val(`${parts_second_tags[i].category_name}`).text(`${parts_second_tags[i].name}`)).selectmenu().selectmenu("refresh",true);
			}
    }
  });
});

// *************Second Tag の表示 **************更新時
//Secondタグの情報をデータベースから取得
function show_second_tag_update(Select_Id,default_value){
  $(Select_Id).empty();
  isSelected =  ("main" === default_value);
  $(Select_Id).append($("<option>").val("main").prop('selected', isSelected).text("Secondタグを選んでください"));
  var firstTag = $('select[name="parts_update_first_tag"] option:selected').attr("class");
  for (var i=0;i<parts_second_tags.length;i++){
      var secondTag = parts_second_tags[i];
      isSelected =  (secondTag.category_name === default_value);
      if(parts_second_tags[i].class === firstTag){
        $('select[name="parts_update_second_tag"]').append($("<option>").val(`${secondTag.category_name}`).prop('selected', isSelected).text(`${secondTag.name}`)).selectmenu().selectmenu("refresh",true);
  }
 }
}

//タグの調整　更新時
$(function() {
  $('select[name="parts_update_first_tag"]').change(function() {

    var firstTag = $('select[name="parts_update_first_tag"] option:selected').attr("class");
    
    var count = parts_second_tags.length;

    $('select[name="parts_update_second_tag"]').empty();
    for (var i=0;i<count;i++){
      var secondTag = parts_second_tags[i];
      if(parts_second_tags[i].class === firstTag){

				$('select[name="parts_update_second_tag"]').append($("<option>").val(`${parts_second_tags[i].category_name}`).text(`${parts_second_tags[i].name}`)).selectmenu().selectmenu("refresh",true);
			}
    }
  });
});

// *******************************************
//セレクトボックスの変更
function select_Change(first_Select_Name){
    var firstTag = $(`select[name=${first_Select_Name}]option:selected`).attr("class");
}

//タグ情報の取得
$.when(
  getTag("FirstTag"),
).done(function(){
  getTag("SecondTag");
});

// **************************************************************
//検索Boxのポップアップ
function openDlog(){
  $.mobile.changePage("#popupKeyWord");
}

//ボタンを押すと関数が発動
$(function() {
  $("#LoginBtn").click(onLoginBtn);
  $("#RegisterBtn").click(onRegisterBtn);
  $("#RegisterPartsBtn").click(onSaveFileBtn);
  $("#ExplorePartsBtn").click(onExplorePartsBtn);
  $("#updateUserBtn").click(onUpdateUserBtn);
});

//************ ユーザーに関するコード *************//
//現在ログイン中ユーザー
var currentLoginUser; 

//自動ログイン機能
checkCurrentUser();

function checkCurrentUser(){
    var currentUser = ncmb.User.getCurrentUser();
    if (currentUser){
        ncmb.User.fetch()
            .then(function(results){
              
              setTimeout(function(){console.log("自動ログイン")}, 2000);

              //タブデータ取得
              console.log("onShowFirstTagsBtnに移動");
              onShowFirstTagsBtn();
              //レンタルデータ取得
              console.log("onRentalTagsBtnに移動");
          　　 showRentalData();
            })
            .catch(function(err){
              ncmb.User.logout();
                //このあとはログイン画面を表示とか
            });
    } else {
        //未ログインの場合はログイン画面を表示とか
    }
}

//ユーザー登録関数
function onRegisterBtn(){
    $(".name_error").empty();
    $(".password_error").empty();
    $(".password_confirm_error").empty();

    //入力フォームからusername, password変数にセット
    var username = $("#reg_username").val();
    var password = $("#reg_password").val();
    var password_confirm = $("#reg_password_confirm").val();

     //エラーチェック
    if(username === ""){
      $(".name_error").append("名前が入力されていません");
    }else if(password === ""){
      $(".password_error").append("パスワードが入力されていません");
    }else if(password.length < 6){
      $(".password_error").append("パスワードが5文字以下です");
    }else if(password !== password_confirm){
      $(".password_error").append("パスワードが一致しません");
    }else{
        //ユーザーインスタンスを生成・データを保存
        var user = new ncmb.User();
        user.set("userName", username)
            .set("password", password);
        
        // 任意フィールドに値を追加 
        user.signUpByAccount()
            .then(function(user) {
            　navigator.notification.confirm("新規登録に成功");
              currentLoginUser = ncmb.User.getCurrentUser();
               //タブデータ取得
              console.log("onShowFirstTagsBtnに移動");
              //onShowFirstTagsBtn();
              //レンタルデータ取得
              //console.log("onRentalTagsBtnに移動");
          　  //showRentalData();
          

              ncmb.User.logout();
              navigator.notification.confirm("再ログインをしてください");
              //currentLoginUser = null;
              //$.mobile.changePage($('#LoginPage'),{type:"post",reverse: true});
              // alert("現在、新規登録を行えません。");
               
            })
            .catch(function(error) {
              navigator.notification.alert("新規登録に失敗しました" + error);
            });
    }
}

//ログイン
function onLoginBtn()
{
    $(".name_error").empty();
    $(".password_error").empty();

    //入力フォームからusername, password変数にセット
    var username = $("#login_username").val();
    var password = $("#login_password").val();

    //エラーチェック
    if(username === ""){
      $(".name_error").append("名前が入力されていません");
    }else if(password === ""){
      $(".password_error").append("パスワードが入力されていません");
    }
    // ユーザー名とパスワードでログイン
    ncmb.User.login(username, password)
        .then(function(user) {
          //メインページに移動
          // alert("ログイン成功");
          navigator.notification.confirm("次回以降のログインは自動となります。解除するにはログアウトを行なってください。");
          currentLoginUser = ncmb.User.getCurrentUser();
          //タブデータ取得
          console.log("onShowFirstTagsBtnに移動");
          onShowFirstTagsBtn();
          //レンタルデータ取得
          console.log("onRentalTagsBtnに移動");
      　　 showRentalData();
        })
        .catch(function(error) {
          navigator.notification.alert("ログインに失敗しました");
        });
}

//ユーザー変更画面表示
function onUpdateUserData(){
    $("#update-user").empty();

    var user = ncmb.User.getCurrentUser();

    //取得ユーザー名
    $("#update-user").append(`
    <label for="un" class="ui-hidden-accessible">User Name:</label>
    <input type="text" id="update_username" value="${user.userName}">`).trigger("create");
    $.mobile.changePage($('#UpdateUserPage'),{type:"post",reverse: true});
}


//ユーザー更新
function onUpdateUserBtn(){

  currentUser = ncmb.User.getCurrentUser();

  var username = $("#update_username").val();
  var new_password = $("#new_password").val();
  var new_password_confirm = $("#new_password_confirm").val();
  var check_password = $("#check_password").val();
  

  if(!new_password){
    console.log("パスワード変更なし");
    new_password = currentUser.password;
    new_password_confirm = currentUser.password;}

  if(new_password !== new_password_confirm){
    navigator.notification.alert("パスワードが一致しません");
  }else if(check_password === ""){
    navigator.notification.alert("パスワードを打ち込んでください");
  }else if(check_password  !== currentUser.password){
    navigator.notification.alert("パスワードが違います");
  }else{
    $.mobile.showPageLoadingMsg();
    currentUser.set("userName",username)
                .set("password",new_password)
                .update()
                .then(function(obj){
                  console.log(obj);
                　$.mobile.hidePageLoadingMsg();
                  navigator.notification.confirm("ユーザー情報の変更を完了しました");
                  $.mobile.changePage($("#MainPage"),{type:"post",reverse: true});
                  location.reload();
                  navigator.notification.confirm("反映させるには再ログインが必要です");
      })
      .catch(function(error){
            console.log("ユーザーテーブルに保存に失敗しました: "+error);
      })


  }
}

function openLogoutDlog(){
  $.mobile.changePage("#popupLogout");
}

function openHelp(){
  $.mobile.changePage("#popupHelp");
}


//ログアウト
function onLogoutBtn()
{
  ncmb.User.logout();
  currentLoginUser = null;
  location.reload();
  $.mobile.changePage($('#LoginPage'),{type:"post",reverse: true});
  
}

/********** 画像関連のコード　*************/
//画像データを一旦保存
var image_byteCharacter;

// 写真撮影の関数
function shoot(situation){
    var option = {
        quality: 50, destinationType: Camera.DestinationType.DATA_URL,
        saveToPhotoAlbum: false //撮影後端末に保存しない
    };
    
    //カメラを起動
    navigator.camera.getPicture(onSuccess, onError, option);
        
    //成功時に呼び出されるコールバック関数
    function onSuccess(imageData){
        //photo idに画像を表示
        var value = situation.name;
        if(value==="register"){
         var image = document.getElementById('photo');
        }else{
         var image = document.getElementById('updatePhoto');
        }
        image.src = "data:image/jpeg;base64," + imageData; 

        //グローバル変数に保存
        image_byteCharacter = image.src;
    }
        
    //失敗時に呼び出されるコールバック関数
    function onError(message){
        console.log("もう一度撮影してください");
    }
}


//画像の形式変換
function dataURItoBlob(dataURI) {
    if(!dataURI){
      navigator.notification.alert("画像を挿入してください");
    }
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], {type:mimeString});
}

//画像をファイルストアに保存
function onSaveFileBtn(){
  
    //ファイル名を定義
     if (image_byteCharacter != null) {
      var photoFileName = Date.now() + "_" + ".png";
     }

    //画像ファイルインスタンスを生成
      //画像ファイルを保存
      ncmb.File.upload(photoFileName, dataURItoBlob(image_byteCharacter))
      .then(function() {
         console.log("画像完了");
         if(photoFileName){console.log("photoFileName"+photoFileName);}else{
           console.log("dd");
         }
         

         onRegisterPartsBtn(photoFileName);
        },
        function(error) {
        　// The file either could not be read, or could not be saved to NCMB.
          console.log("画像保存エラー"+error);
        });
}

//画像ファイルをblob形式で取得
function onDownloadFileBtn(fileName,HTML_ID){

  //ファイル形式を取得
  ncmb.File.download(fileName, "blob")
      .then(function(blob) {
        // ファイルリーダーにデータを渡す
         var reader = new FileReader();
          reader.onloadend = function() {
            //HTMLに画像を表示
            var img = document.getElementById(HTML_ID);
            if(img){
            img.src = reader.result;
            //console.log("リーダー設定完了");
            }
          }
        var dataUrl = reader.readAsDataURL(blob);
        //console.log(dataUrl);
        return dataUrl;
      })
      .catch(function(err) {
        console.error(err);
      })
}

//************   部品に関するコード    *************//

//入力のタグを分割して配列で渡す
function onSetMinimumTag(value){
 
  var tag_list = value.split(',');
  let tag_object = {a:"",b:"",c:""};
   var i = 0;
  for(let k in tag_object){
    tag_object[k] = tag_list[i];
    i = i+1;
    ;}
  return tag_object;
}

//部品の登録画面を表示
function onShowRegisterParts(){
  show_select_box("#parts_register_number",-1);
  show_first_tag("#parts_register_first_tag", "main");
  show_second_tag("#parts_register_second_tag","main");
  $.mobile.changePage($("#DetailPage"),{type:"post",reverse: true,allowSamePAgeTransition:true});
  
  const target = document.getElementById('target');
  target.addEventListener('change', function (e) {
    const file = e.target.files[0]
    const reader = new FileReader();
    reader.onload = function (e) {
        const img = document.getElementById('photo');
        img.src = e.target.result;
        image_byteCharacter = img.src;
    }
    reader.readAsDataURL(file);
}, false);
}


//Firstタグの表示
function onShowFirstTagsBtn(){
  $(".inner_frame").empty();

  $(".inner_frame").append(`
  <div class="button-tab">
  <a href="#" class="button-tab-a" style="color:#fff;" data-ajax="false" onclick="onShowFirstTagsBtn();showRentalData();" data-icon="bars">貸出リスト</a>
   </div>`).trigger('create');

   for(i=0; i<parts_first_tags.length; i++){
     console.log("name: "+parts_first_tags[i].name);
         $(".inner_frame").append(`
            <div class="button-tab">
             <a href="#" class="button-tab-a" style="color:#fff;" data-ajax="false" name="${parts_first_tags[i].category_name}" onclick="onShowPartsBtn(this,'${parts_first_tags[i].name}');return false;"  data-icon="plus">${parts_first_tags[i].name}</a>
            </div>
        `).trigger('create');
   };
}

//Secondタグの表示
function onShowSecondTagsBtn(firstTag){
    $(".inner_frame").empty();
      $(".inner_frame").append(`
        <div class="button-tab-second">
        <a href="#" class="button-tab-a" style="color:#fff;" data-ajax="false" onclick="onShowFirstTagsBtn();showRentalData();" data-icon="bars">貸出リスト</a>
        </div>`).trigger('create');

    var count = parts_second_tags.length;

    for (var i=0;i<count;i++){
      var secondTag = parts_second_tags[i];
      if(parts_second_tags[i].class === firstTag){
        console.log("secondTag:  " + parts_second_tags[i].class);
				$(".inner_frame").append(`
            <div class="button-tab-second">
             <a href="#" class="button-tab-a" style="color:#fff;" data-ajax="false" name="${parts_second_tags[i].category_name}" onclick="onShowPartsBtn(this,'${parts_second_tags[i].name}');return false;"  data-icon="plus">${parts_second_tags[i].name}</a>
            </div>
        `).trigger('create');
			}
    }
}


//部品の登録画面
function onRegisterPartsBtn(photoFileName){
    $.mobile.showPageLoadingMsg();

    //mBaaSに保存先のクラスを指定
    var SaveParts = ncmb.DataStore("Parts");
    //部品クラスのインスタンスの生成
    var saveparts = new SaveParts();

    //登録名
    var name = $("#parts_register_name").val();

    //タグの設定
    // const parts_minimum_tag = $("#parts_register_tag").val();
  
    //個数のセレクト
    var parts_number = $('select[name="parts_register_number"]').val();
    console.log("parts_number"+parts_number);


    //タグ1のセレクト
    var parts_first_tag = $('select[name="parts_register_first_tag"]').val();
    console.log("parts_first_tag"+parts_first_tag);
    
    //タグ2のセレクト
    var parts_second_tag = $('select[name="parts_register_second_tag"]').val();


    //最小タグを配列化
    tag_list=[];
    // if(parts_minimum_tag !== ""){
    //  tag_list = onSetMinimumTag(parts_minimum_tag);
    //  };


    //部品のDB登録
    if(name === ""){
      $.mobile.hidePageLoadingMsg();
      navigator.notification.alert("部品名を登録してください");
      
    }else if(parts_number === "" || parts_number === -1){
      $.mobile.hidePageLoadingMsg();
      navigator.notification.alert("個数を登録してください");
    }else if(parts_second_tag === "" || parts_first_tag === ""){
      $.mobile.hidePageLoadingMsg();
      navigator.notification.alert("タグを登録してください");
    }else if(photoFileName === ""){
      $.mobile.hidePageLoadingMsg();
      navigator.notification.alert("写真を設定してください")
    }else{
      

      //新規インスタンスにデータをセットする
      saveparts.set("name",name)
               .set("number",Number(parts_number))
               .set("remaining_number", Number(parts_number))
               .set("firstTag",parts_first_tag)
               .set("secondTag",parts_second_tag)
               .set("image_file",photoFileName)
               .save()
               .then(function(results){
                 navigator.notification.alert('部品を登録しました',// message
                      alertDismissed,         // callback
                      `部品名：${name}`);
                 $.mobile.hidePageLoadingMsg();
                 $.mobile.changePage($("#MainPage"),{type:"post",reverse: true,allowSamePAgeTransition:true});
                 location.reload();
               })
               .catch(function(error){
                navigator.notification.alert("保存できませんでした");
               });
    }
}

//固有の部品の更新ページを表示
function onGetParts(parts_id){

  var parts_id = parts_id.name;

  //インスタンスの作成
  var SaveParts = ncmb.DataStore("Parts");

  //データを降順で取得します
  //必要なデータだけを取得できるようにする
  SaveParts.order("createDate",true)
           .equalTo("objectId",parts_id)
           .fetchAll()
           .then(function(results){
             onShowUpdateParts(results);
           })
           .catch(function(error){
             navigator.notification.alert('検索に失敗しました');
           })
}

//固有の部品の更新ページを表示
function onShowUpdateParts(results){

  $("#UpdateName").empty();
  $("#parts_update_content").empty();
  $("#UpdateBox").empty();

  console.log("部品更新ページへ移動");
  $.mobile.changePage($("#UpdatePartsPage"),{type:"post",reverse: true})
  var parts_data = results[0];
  var name = parts_data.get("name");
  var number = parts_data.get("number");
  var remaining_number = parts_data.get("remaining_number");
  var rental_number = number - remaining_number;
  var firstTag = parts_data.get("firstTag");
  var secondTag = parts_data.get("secondTag");
  //var minimumTag = parts_data.get("minimumTag");
  var content = parts_data.get("content");
  var data_url = onDownloadFileBtn(parts_data.get("image_file"),'updatePhoto');

  if(!content){
    content = "部品の説明・備考を登録しよう！";
  }

  $("#UpdateName").append(`
   <label>部品名:</label>
   <form class="form">
    <input type="text" id="parts_update_name" value="${name}">
   </form>`).trigger("create");

  show_select_box("#select_number_update",number);
  show_first_tag("#parts_update_first_tag",firstTag);
  show_second_tag_update("#parts_update_second_tag", secondTag);

  $("#ContentUpdate").append(`
    <form class="form">
      <label>Content:</label>
      <textarea id="parts_update_content" rows="4" cols="40">${content}</textarea
    </form>`).trigger("create");

    
    $("#UpdateBox").append(`
    <input href="#" onclick="onUpdateParts(this,${data_url});" type="button" data-inline="false" data-theme="a" name="${parts_data.get("objectId")}" value="更新">`).trigger("create");
}

//部品の更新関数
function onUpdateParts(parts_data,photoFileName){
    var parts_id = parts_data.name;
    var tag_list = "";

    //名前の更新
    var name = $("#parts_update_name").val();
    console.log("名前"+parts_number);

    //個数の更新
    var parts_number = $('select[name="parts_update_number"]').val();
    console.log("個数"+parts_number);

    //タグ1の更新
    var parts_first_tag = $('select[name="parts_update_first_tag"]').val();
    console.log("第一タグ"+parts_first_tag);
  
    //タグ2の更新
    var parts_second_tag = $('select[name="parts_update_second_tag"]').val();
    console.log("第二タグ"+parts_second_tag);

    //最小タグの更新
    var parts_content = $("#parts_update_content").val();
    console.log("内容"+parts_content);


    // if(parts_minimum_tag !== ""){ 
    //   tag_list = onSetMinimumTag(parts_minimum_tag);}
    // console.log("タグ"+tag_list);
    

    //現在ログイン中のユーザーを登録したい
    //部品のDB登録
    //mBaaSに保存先のクラスを指定
    var SaveParts = ncmb.DataStore("Parts");
    //部品クラスのインスタンスの生成
    var saveparts = new SaveParts();

    //部品のDB登録
    if(name === ""){
      navigator.notification.alert("部品名を登録してください");
    }else if(parts_number === ""){
      navigator.notification.alert("個数を登録してください");
    }else if(parts_second_tag === "" || parts_first_tag === ""){
      navigator.notification.alert("タグを登録してください");
    }else if(photoFileName === ""){
      navigator.notification.alert("写真を設定してください")
    }else if(!parts_content){
      parts_content = "部品の説明・備考を記述しましょう";
      console.log("内容なし");
    }else{
    //新規インスタンスにデータをセットする
    SaveParts.equalTo("objectId",parts_id)
             .order("createDate",true)
             .fetchAll()
             .then(function(results){

               $.mobile.showPageLoadingMsg();

              //貸し出しされている状態で変更が行われた際の個数処理
              var sum_parts = results[0].get("number");
              var sum_remaining = results[0].get("remaining_number");
              var rental_number = sum_parts - sum_remaining;
              var sum_remaining = Number(parts_number) - rental_number;

              saveparts.set("objectId",parts_id)
                       .set("name",name)
                       .set("number",Number(parts_number))
                       .set("remaining_number", sum_remaining)
                       .set("firstTag",parts_first_tag)
                       .set("secondTag",parts_second_tag)
                       .set("content",parts_content)
                       .set("image_file",photoFileName)
                       .update()
                       .then(function(results){
                         $.mobile.hidePageLoadingMsg();
                          navigator.notification.alert('部品を更新しました',// message
                              alertDismissed,         // callback
                              `部品名：${name}`);
                          $.mobile.changePage($("#MainPage"),{type:"post",reverse: true,allowSamePAgeTransition:true});
                          location.reload();
                        })
                        .catch(function(error){
                          console.log("保存できませんでした"+error);
                          navigator.notification.alert("部品情報を更新できませんでした");
                        });

              })
              .catch(function(error){
                navigator.notification.alert("検索できませんでした");
              });
    }
}

//タグ・キーワード検索
function onExplorePartsBtn(){
  //検索個数を0に
  search_count = 0;

  var keyword = $("#keyword_explore_form").val();

  $("#partscard").empty();

  //インスタンスの作成
  var SaveParts = ncmb.DataStore("Parts");
  // var subquery1 = SaveParts.equalTo("firstTag", keyword);
  // var subquery2 = SaveParts.equalTo("secondTag", keyword);
  var subquery_key = SaveParts.equalTo("name", keyword);

  //データを降順で取得します
  //必要なデータだけを取得できるようにする
  SaveParts.equalTo("name", keyword)
           .order("createDate",true)
           .fetchAll()
           .then(function(results){
             console.log(results[0]);
             setPartsData(results,keyword,keyword,search_count);
           })
           .catch(function(error){
             navigator.notification.alert("検索に失敗しました。管理者にお知らせください。");
           })
}

//カテゴリ検索
function onShowPartsBtn(parts,parts_name){
  console.log("onShowPartsBtnに移動");
  
  //検索個数を0に
  search_count = 0;

  //要素のHTMLを空に
  $("#partscard").empty();


  //部品テーブルのデータを取得
  var SaveParts = ncmb.DataStore("Parts");

  //firstTagの名前
  var parts_category_name = parts.getAttribute('name');
  console.log(parts_category_name);

  //if partsがfirstTagの中にあれば
  for(i=0;i<parts_first_tags.length;i++){
    if (parts_first_tags[i].category_name === parts_category_name){
      onShowSecondTagsBtn(parts_category_name);
    }
  }

  firstTag = SaveParts.equalTo("firstTag",parts_category_name);
  secondTag = SaveParts.equalTo("secondTag",parts_category_name);

  //データを降順で取得します
  //必要なデータだけを取得できるようにする
  SaveParts.or([firstTag,secondTag])
           .order("updateDate",true)
           .limit(n)
           .fetchAll()
           .then(function(results){
             //alert("全件検索に成功しました"+results.length+"件");
             //検索数の合計
             search_count = search_count + n;
             console.log("onShowPartsBtn: "+search_count);
             setPartsData(results,parts_category_name,parts_name,search_count);
           })
           .catch(function(error){
             navigator.notification.alert("検索に失敗しました。管理者にお知らせください。");
           })
}

//部品の続きを取得
function onShowPartsNextBtn(word,name,search_count){

  //部品テーブルのデータを取得
  var word = word.name;
  var SaveParts = ncmb.DataStore("Parts");

  var secondTag = SaveParts.equalTo("secondTag", word);
  var keyword = SaveParts.equalTo("name", word);
  var firstTag = SaveParts.equalTo("firstTag", word);

  //データを降順で取得します
  //必要なデータだけを取得できるようにする
  SaveParts.or([secondTag,keyword,firstTag])
           .skip(search_count)
           .limit(n)
           .order("updateDate",true)
           .fetchAll()
           .then(function(results){
            //alert("全件検索に成功しました"+results.length+"件");
             //検索数の合計
             console.log("全件検索に成功しました"+results.length+"件");
             console.log("search_count: "+ n);
             search_count = search_count + n;
             console.log("onShowPartsNextBtn: "+search_count);
             setPartsData(results,word,name,search_count);
             //$.mobile.changePage('#ListUpPage');
           })
           .catch(function(error){
            //alert("全件検索に失敗しました: " +error);
           })

}

//部品の検索結果を表示
function setPartsData(results,word,name,search_count){

  //word -> 検索をかけるcategory_name:英字
  //name -> ヘッダーに表示するカテゴリ名：日本語
  //search_count -> 何度目のロード処理か - 昇順で何番目のデータを取ってくるか
  $("#header-title").empty();
  $("#reload").empty();
  $("#header-title").append(`${name}`);

  //データを取得
  for(i=0; i<results.length; i++){
    var parts_data = results[i];
  
    var parts_name = parts_data.get("name");
    var parts_number = parts_data.get("number");
    var parts_image = parts_data.get("image_file");


    var data_url = onDownloadFileBtn(parts_image,`image_results_${parts_name}`);
      $("#partscard").append(`
          <button data-ajax="false" data-role="button" type="button" name="${parts_data.get("objectId")}" onclick="onDetailPartsBtn(this);return false;"> 
          <div class="card-image">
          <img id="image_results_${parts_name}" width="130px" height="150px">
          <p><small>${parts_name}</small></p>
          </div></button>
        `).trigger("create");
    }

    $("#reload").append(`
    <input type="button" data-theme="a" href="#" onclick="onShowPartsNextBtn(this,'${name}',${search_count});" name="${word}" value="Next" data-icon="refresh">`).trigger("create");

    //検索件数の表示
    var searchResult = document.getElementById("searchResult");
    searchResult.innerHTML = "「"+name+"」の検索結果：";
        
    //セットするデータが無かった場合
    if(results.length === 0){
      $("#reload").empty();
      $("#reload").append(`<div class="card card_shadow">
        <div class="card-body">
        <p style="text-align:center;" class="card-text">残り0件</p>
        </div></div>`);  
    }
    console.log("部品一覧ページで移動");
    $.mobile.changePage($('#ListUpPage'),{type:"post",reverse: true});
}

//*****************   タグに関するコード　　 **************//
//タグの分類
$(function() {
	// タグが変更されたら発動
	$('select[name="parts_register_first_tag"]').change(function() {
		// 選択されているタグのクラス名を取得
		var firstTagName = $('select[name="parts_register_first_tag"] option:selected').attr("class");

		// 要素数を取得
		var count = $('select[name="parts_register_second_tag"]').children().length;
		
		// for文で回す
		for (var i=0; i<count; i++) {
			var secondTag = $('select[name="parts_register_second_tag"] option:eq(' + i + ')');
			if(secondTag.attr("class") === firstTagName){
				secondTag.show();
			}else {
        if(secondTag.attr("class") === "msg"){
          secondTag.show();
          secondTag.prop('selected', true);
        }else{
				// 都市の要素を非表示
				secondTag.hide();
        }
			}
    }
	})
})


//**************  レンタルに関するコード  ****************/
//部品の詳細・レンタルページ
function onDetailPartsBtn(part){
 var parts_id = part.name;

 //インスタンスの作成
 var SaveParts = ncmb.DataStore("Parts");

//データを降順で取得します
//必要なデータだけを取得できるようにする
  SaveParts.order("createDate",true)
           .equalTo("objectId",parts_id)
           .limit(1)
           .fetchAll()
           .then(function(results){
             setDetailParts(results);
           })
           .catch(function(error){
             navigator.notification.alert("検索に失敗しました。管理者にお知らせください。");
           })
}

//部品の詳細・貸し出しボタン
function setDetailParts(results){

  //Jquery処理
  $("#partsDetailCard").empty();
  $("#toRentalPageBtn").empty();
  $("#rentalBtn").empty();

  var part_data = results[0];
  var data_url = onDownloadFileBtn(results[0].get("image_file"),'card-img-top');
  var parts_id = part_data.get("objectId");
  onGetPartsRentalData(parts_id);

  var content = part_data.get("content");
  if(!content){
    content = "部品の説明・備考を登録しよう！";
  }

  $("#partsDetailCard").append(`
          <div class="card-image">
          　<img id="card-img-top" src="${data_url}" width="100%" height="300px">
          　<h2>${part_data.get("name")}</h2>
          </div>

          <table class="company">
            <tbody>
            <tr><th class="arrow_box">個数</div></th>
            <td><h4>${part_data.get("number")}個</h4></td></tr>
            <tr><th class="arrow_box">在庫数</th>
            <td><h4>${part_data.get("remaining_number")}個</h4></td></tr>
            <tr><th>カテゴリ</th>
            <td><h4>${part_data.get("firstTag")} → ${part_data.get("secondTag")}</h4></td></tr>
            <tr><th>説明</th><td>
             <p>${content}</p>
            </td></tr>
            </tbody>
            </table>

        <input onclick="onGetParts(this);" type="button" 　data-role="button"　data-transition="slidedown"   data-theme="a" name="${part_data.get("objectId")}" data-icon="refresh" value="更新">
          `).trigger('create'); 
          
  if(Do_you_rental_delay === false){
 　　 $("#toRentalPageBtn").append(`
           <a href="#" data-ajax="false" name="${part_data.get("objectId")}" class="square_btn_rental" style="border-bottom: solid 4px aqua;" onclick="onRentalPartsBtn(this,${results[0].get("remaining_number")});return false;">
           <p style="text-align:center;color:white;">レンタルする！</p></a>
          `).trigger('create');
          
  }else{
     $("#toRentalPageBtn").append(`
           <a href="#" disabled class="square_btn_rental" data-ajax="false" style="border-bottom: solid 4px red;">
           <p style="text-align:center;color:white;">延滞中はレンタルできません</p></a>
           `).trigger('create');
  }
　　　
    //セットするデータが無かった場合
    if(results === null){
        var table = document.getElementById("partsDetailCard");
        formTable.innerHTML = "<br>" + "<center>" + "データはありません" + "</center>" + "<br>";}
    $.mobile.changePage($('#DetailPartsPage'),{type:"post",reverse: true,allowSamePAgeTransition: true,reloadPage:true});
}

//レンタル履歴取得関数
function onGetPartsRentalData(parts){
  var parts_id = parts;
  console.log(parts_id);

  // リレーション先のデータを全件検索/取得
  var SaveParts = ncmb.DataStore("Parts");
  const Rental = ncmb.DataStore("Rental");

  SaveParts.equalTo("objectId",parts_id)
           .fetchAll()
           .then(function(results){
                //現在のユーザーのレンタル状況を取得
                
                Rental.relatedTo(results[0], "rental")
                      .order("createDate",true)
                      .fetchAll()
                      .then(function(results){
                          onShowPartsRentalHistory(results);
                        })
                        .catch(function(error){
                          navigator.notification.alert("検索に失敗しました: " +error);
                        })
              })
              .catch(function(error){
                navigator.notification.alert("検索に失敗しました。管理者にお知らせください。");
              })
}

//レンタル履歴表示関数
function onShowPartsRentalHistory(results){
  $("#history").empty();
  $(".chart-data").empty();
  
  var tr='';
  if(results.length === 0){
    $("#history").append(`レンタル履歴はありません`);
  }else{
     $("#history").append(`
        <table class="brwsr2">

        <tbody>
          <tr><th>名前</th>
          <td class="data fst">貸出日</td>
          <td class="data fst">返却日</td>
          </tr>
        </tbody>
        </table>
        <div class="chart-data">
        `).trigger('create');
  }

  if(results.length>6){
    results.length = 6;
  }

  for(var i=0;i<results.length;i++){
    var return_date = String(results[i].get("return_date").iso).substr(0,10);
    var create_date = String(results[i].get("createDate")).substr(0,10);
    console.log(results[i].get("createDate"));
    var number = results[i].get("number");
    console.log(number);
  if(number === 0){
    return_date = "返却済";
  }
   
$(".chart-data").append(`
    <table class="brwsr2">
    <tbody>
      <tr><th>${results[i].get("user_name")} </th>
      <td class="data fst">${create_date}</td>
      <td class="data fst">${return_date}</td>
      </tr>
      <tr>
      <td class="bar" colspan="6"></td>
      </tr>
    </tbody>
    </table></div>`).trigger('create');
  }
}

//貸し出し登録画面
function onRentalPartsBtn(results,remaining_number){

  //Jquery処理
  //貸し出し登録ページへ遷移
  $.mobile.changePage('#popupRental',{type:"post",reverse: true});
  $('#rental_select_box').empty();
  $("#rental_btn").empty();

  //残りレンタル可能個数を表示
  //データベース連携
  var parts_id = results.name;
  var parts_number = remaining_number;

  for(i=0;i<parts_number;i++){
    $("#rental_select_box").append($("<option>").val(`${i+1}`).text(`${i+1}`)).selectmenu("refresh");
  }
  if(Do_you_rental_delay === false){
    $("#rental_btn").append(`<div>
    <input href="#" onclick="onToRentalTable(this);" type="button" data-inline="false" data-theme="a" name="${parts_id}" value="部品をレンタルする"></div>`).trigger('create');
  }else{
    var searchResult = document.getElementById("rental_btn");
    searchResult.innerHTML = "延滞期間はレンタルできません";
    $("rental_btn").append('<div><h3 style="rgba(200,0,0)">延滞期間はレンタルできません</h3></div>');
  }
}

//レンタルテーブルに登録+個数調整を行う関数
function onToRentalTable(id){
  var rental_number = $('select[name="rental_register_number"]').val();
  rental_number = 1;

  //部品のid番号の取得
  var parts_id = id.name;

  //返却期限設定
  var return_date = new Date();
  var dayOfMonth = return_date.getDate();
  return_date.setDate(dayOfMonth + rental_term);

  console.log("rental_number:  "+rental_number);

  //レンタルテーブルに貸し出しを登録
  var SaveRental = ncmb.DataStore("Rental");

  var saverental = new SaveRental();
  var SaveParts = ncmb.DataStore("Parts");

  var user = ncmb.User.getCurrentUser();
  var user_name = user.get("userName");

  var pointer = new SaveParts({"objectId": parts_id});

  if(rental_number){
  //レンタルテーブルにデータを保存
  saverental.set('number', Number(rental_number))
            .set('pointer', pointer)
            .set('user_name', user_name)
            .set('return_date', return_date)
            .save()
            .then(function(results){
              $.mobile.showPageLoadingMsg();
              onRentalRelationParts(parts_id,saverental,rental_number);
            })
            .catch(function(error){
              console.log("レンタルテーブルに保存に失敗しました: " +error);
            })
  }else{
    navigator.notification.alert("個数を入力してください");
  }
}

//レンタル登録(パーツとのリレーション)
function onRentalRelationParts(parts_id,rental,num){

      //現在のパーツを取得
      var SaveParts = ncmb.DataStore("Parts");
      var saveParts  = new SaveParts();
      const relation = new ncmb.Relation();
      relation.add(rental);
  
      //インスタンスにデータをセットする
      //パーツの指定
      SaveParts.equalTo("objectId",parts_id)
        　　　 .order("createDate",true)
              .fetchAll()
              .then(function(results){

                //remaining_numberから残り個数を取得
                var remaining_sum = results[0].remaining_number;
                var rental_sum = Number(num);
                console.log("合計"+remaining_sum);
                console.log("貸し出し個数"+rental_sum);
                //合計から貸し出し個数を引く
                var remaining_sum = remaining_sum - rental_sum;
                console.log("残り"+remaining_sum);

                if(remaining_sum>=0){
                //残り個数を更新
                saveParts.set("objectId", results[0].objectId)
                          .set("name", results[0].name)
                          .set("remaining_number", remaining_sum)
                          .set("rental", relation)
                          .update()
                          .then(function(results){
                         //alert("残り"+remaining_sum+"パーツテーブルに保存");
                         onRentalRelationUser(rental);
                        })
                }else{
                  navigator.notification.alert("在庫個数を超えました");
                }
              })
              .catch(function(error){
                navigator.notification.alert("検索に失敗しました。管理者にお知らせください。");
              })
  }

//レンタル登録(ユーザーとのリレーション)
function onRentalRelationUser(rental){

  const user = ncmb.User.getCurrentUser();
  const relation = new ncmb.Relation();
  //rental個数のデータとobjectIdを紐付ける
  relation.add(rental);
  console.log("user"+user.get("userName"));

  user.set('rental', relation)
      .update()
      .then(function(results){
        $.mobile.hidePageLoadingMsg();
        navigator.notification.confirm("レンタル期間は2週間です");
        $.mobile.changePage($("#MainPage"),{type:"post",reverse: true});
        location.reload();
      })
      .catch(function(error){
        navigator.notification.alert("検索に失敗しました。管理者にお知らせください。");
      })
}

//レンタル状況の取得
function showRentalData(){

  // リレーション先のデータを全件検索/取得
  const rental = ncmb.DataStore("Rental");

  //現在のユーザーのレンタル状況を取得
  rental.relatedTo(ncmb.User.getCurrentUser(), "rental")
        .include("pointer")
        .greaterThan("number", 0)
        .order("createDate",false)
        .fetchAll()
        .then(function(results){
            setRentalData(results);
            $.mobile.changePage($('#MainPage'),{type:"post",reverse: true,allowSamePAgeTransition:true});
          })
          .catch(function(error){
            navigator.notification.alert("検索に失敗しました。管理者にお知らせください。" );
          })
}

//todayオブジェクト型を一旦数値に変換
function today_date (){
  var today = new Date();
  var today_FullYear = String(today.getFullYear());
  var today_Year = Number(today_FullYear.slice(2,4));
  var sum_today = today_Year*10000+(today.getMonth()+1)*100+today.getDate();
  return sum_today;
}

//返却日と今日を比較
function compareDate(today,return_date){
  return_date = String(return_date);
  var return_day = Number(return_date.substr(2,2)+return_date.substr(5,2)+return_date.substr(8,2));
  return remaining_date = return_day - today;
}

function date_convert(return_date){
  var return_day = return_date.substr(0,4)+"/"+return_date.substr(5,2)+"/"+return_date.substr(8,2);
  return return_day;
}


//レンタル状況の可視化
function setRentalData(data){
  $("#rental_situation_data").empty();
  $("#rental_situation_nothing").empty();  
  $(".notice_delay").empty();
  $("#rental_situation_user").empty();

  var currentUser = ncmb.User.getCurrentUser();
  var username = currentUser.userName;
  

  var rental_data = data;
  var today = today_date();

  //返却遅れのレンタル個数
  var return_delay = 0;

  $("#rental_situation_user").append(`${username}さんのレンタル部品/返却期限：`).trigger('create');  
  
  for(i=0;i<rental_data.length;i++){
    var date = rental_data[i].return_date.iso;
    var remaining_date =  compareDate(today,date);
    var return_day = date_convert(date);


    //カードの色指定
    var back_color;

    if(remaining_date < 0){
      return_day = "延滞中";
      back_color = "rgba(200,0,0,0.65)";
      Do_you_rental_delay = true;
      return_delay = return_delay + 1;
    }else{
      back_color = "rgba(0,0,0,0.65)";
    }

    console.log(rental_data[i].pointer.image_file);
    var data_url = onDownloadFileBtn(rental_data[i].pointer.image_file,`image_${rental_data[i].pointer.name}`);

    if(return_delay > 0){
    $(".notice_delay").append(`<span class="ui-li-has-count ui-li-count ui-btn-up-c ui-btn-corner-all">${return_delay}</span>`).trigger("create");}

      $("#rental_situation_data").append(`
        <button data-ajax="false" data-role="button" type="button" name="${rental_data[i].objectId}" onclick="toReturnPage(this,${rental_data[i].number});return false;"> 
        <div class="card-image">
          <img id="image_${rental_data[i].pointer.name}" width="130px" height="150px">
          <p style="text-align:center;background:${back_color};">残り${remaining_date}日</p>
        </div></button>`).trigger('create');  
      };

          //   <button data-ajax="false" data-role="button" type="button" name="${parts_data.get("objectId")}" onclick="onDetailPartsBtn(this);"return false;"> 
          // <div class="card-image">
          // <img id="image_results_${parts_name}" width="130px" height="150px">
          // <p class="card-title">${parts_name}</p>
          // </div></button>

// <p class="card-text" style="background:${back_color};">${rental_data[i].pointer.name}</p>
//<p class="card-text">レンタル数：${rental_data[i].number}個</p>
//       <input type="button" class="ui-btn-right" data-icon="action" data-role="button" data-transition="slidedown" value="返却" data-theme="a" name="${rental_data[i].objectId}"  onclick="toReturnPage(this,${rental_data[i].number});return false;">


  //セットするデータが無かった場合
    if(rental_data.length == 0){
    $("#rental_situation_nothing").append(`<div class="card card_shadow">
        <div class="card-body help">
        <p class="card-text">現在レンタルはしていません</p>
        <a href="#" onclick="openHelp();" type="button" data-inline="false" data-theme="a">アプリのすすめ</a>
        </div></div>`).trigger("create");  
    }else{
      $("#rental_situation_nothing").empty();
    }; 
}

//レンタル返却画面ページでの動作
function toReturnPage(results,number){
   //レンタルテーブルのIDを取得
  var rental_id = results.name;

  $("#onReturnBtn").empty();
  $("#return_select_box").empty();
  for(i=0;i<number;i++){
    $("#return_select_box").append($("<option>").val(`${i+1}`).text(`${i+1}`));
  }

  $("#onReturnBtn").append(`
        <input href="#returnYesNoPopup" onclick="onReturn(this);" type="button" name="${rental_id}" data-inline="false" data-theme="a"  value="返却">
        `).trigger('create');  
   $.mobile.changePage($('#popupReturn'),{type:"post",reverse: true});
}

//レンタルの返却
function onReturn(results){

  //レンタルテーブルのIDを取得
  var rental_id = results.name;

  //返却個数を取得
  var return_number = $('select[name="return_register_number"]').val();


  //レンタルデータのセット
  var Rental = ncmb.DataStore("Rental");
  var rental = new Rental();

  if(return_number){
  $.mobile.showPageLoadingMsg();
  //インスタンスにデータをセットする
  Rental.equalTo("objectId",rental_id)
        .include("pointer")
        .fetchAll()
        .then(function(results){
          var current_rental_number = results[0].number - return_number;
          console.log("現在"+current_rental_number+"つ借りてる");
          var parts_id = results[0].pointer.objectId;
          if(results[0].number >= return_number){
          rental.set("objectId", results[0].objectId)
                .set("number", current_rental_number)
                .update().then(function(data){
                  onReturnToParts(parts_id,return_number);
                  //パーツリストのremain_numnerの更新も必要
                })
          }else{
            $.mobile.hidePageLoadingMsg();
            navigator.notification.alert("返却数が貸し出し数を超えています");
          }
        })
        .catch(function(error){
          $.mobile.hidePageLoadingMsg();
          navigator.notification.alert("返却できませんでした");
        });
  }else{
    $.mobile.hidePageLoadingMsg();
    navigator.notification.alert("返却個数を入力してください");
  }
}

  //レンタルの返却をパーツテーブルに反映
function onReturnToParts(parts_id,return_number){
  //現在のパーツを取得
  var SaveParts = ncmb.DataStore("Parts");
  var saveParts  = new SaveParts();
  
      //インスタンスにデータをセットする
      //パーツの指定
      SaveParts.equalTo("objectId",parts_id)
        　　　 .order("create_date",true)
              .fetchAll()
              .then(function(results){
                //remaining_numberから残り個数を取得
                //残り個数に返却分を追加
                var sum = results[0].number;

                var remaining_number = results[0].remaining_number;

                var remaining_number = Number(remaining_number) + Number(return_number);
                console.log("現在の在庫"+remaining_number);
                
                if(remaining_number <= sum){
                    //残り個数を更新
                    saveParts.set("objectId", results[0].objectId)
                              .set("name", results[0].name)
                              .set("remaining_number", remaining_number)
                              .update()
                              .then(function(results){
                                  $.mobile.hidePageLoadingMsg();
                                  console.log("残り"+remaining_number+"パーツテーブルに保存");
                                  navigator.notification.confirm("返却が完了しました");
                                  $.mobile.changePage($('#MainPage'),{type:"post",reverse: true});
                                  location.reload();
                              })
                              .catch(function(error){
                                $.mobile.hidePageLoadingMsg();
                                navigator.notification.alert("返却できませんでした");
                                });
                }else{
                  $.mobile.hidePageLoadingMsg();
                  navigator.notification.alert("在庫個数を超えました");
                }
               }
,)}

function toShowUserBtn(){
  $.mobile.changePage($("#SettingPage"),{type:"post",reverse: true,allowSamePAgeTransition:true});
}

//全ユーザーの貸し出し状況を取得
function showRentalList(){
  var Rental = ncmb.DataStore("Rental");

  Rental.include("pointer")
        .greaterThan("number", 0)
        .order("create_date", true)
        .fetchAll()
        .then(function(results){
            showRentalUser(results);
          })
          .catch(function(error){
            navigator.notification.alert("検索に失敗しました。管理者にお知らせください。");
          })
}

//全ユーザーの貸し出し状況を可視化
function showRentalUser(data){
  $.mobile.changePage($("#CheckRentalPage"),{type:"post",reverse: true});

  $("#rentalCheckList").empty();

  var rental_data = data;
  var today = new Date();
  
  for(i=0;i<rental_data.length;i++){
  var return_date = rental_data[i].return_date.iso;

  $("#rentalCheckList").append(`
  　　　　<div class="card card_shadow">
        <div class="card-body">
        <p class="card-text">部品：${rental_data[i].pointer.name}</p>
        <p class="card-text">貸し出し個数：${rental_data[i].number}</p>
        <p class="card-text">レンタルユーザー：${rental_data[i].user_name}</p>
        <p class="card-text">在庫数：${rental_data[i].pointer.remaining_number}</p>
        <p class="card-text">返却日：${return_date}</p>`).trigger('create');  
  };

  //セットするデータが無かった場合
    if(rental_data.length === 0){
    $("#rentalCheckList").append(`<div class="card card_shadow">
        <div class="card-body">
        <p class="card-text">現在レンタルはされていません</p>
        </div></div>`);  
    };
}
