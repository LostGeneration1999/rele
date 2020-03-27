// This is a JavaScript file
//部品クラスを定義
class Parts{

  
  //プロパティの定義
  //初期化処理
  constructor(){

    //mBaaSに保存先のクラスを指定
    var SaveParts = ncmb.DataStore("Parts");
    //部品クラスのインスタンスの生成
    var saveparts = new SaveParts();

    this.name = '';
    this.minumum_tag = '';
    this.number = '';
    this.first_tag = '';
    this.second_tag = '';
    this.photoFileName = '';
  }

  //登録処理(引数に画像ファイル)
  register(photoFileName){
    //登録名
    this.name = $("#parts_register_name").val();

    //自由タグ
    const parts_minumum_tag = $("#parts_register_tag").val();
    this.minumum_tag = parts_minumum_tag.split(',');

    //個数のセレクト
    //var parts_number = get_selected_box(form1,parts_register_number);
    this.number = $('select[name="parts_register_number"]').val();

    //タグ1のセレクト
    //var parts_first_tag  = get_selected_box(form2,parts_register_first_tag);
    this.first_tag = $('select[name="parts_register_first_tag"]').val();

    //タグ2のセレクト
    // var parts_second_tag = get_selected_box(form3,parts_register_second_tag);
    this.second_tag = $('select[name="parts_register_second_tag"]').val();

    //画像ファイルの設定
    this.photoFileName = photoFileName;
    
    //部品のDB登録
    if(this.name === ""){
      alert("部品名を登録してください");
    }else if(this.number === ""){
      alert("個数を登録してください");
    }else if(this.second_tag === "" || this.first_tag === ""){
      alert("タグを登録してください");
    }else if(this.photoFileName === ""){
      alert("写真を設定してください")
    }else{
      //新規インスタンスにデータをセットする
      saveparts.set("name",this.name)
               .set("number",Number(this.number))
               .set("remaining_number", Number(this.number))
               .set("firstTag",this.first_tag)
               .set("secondTag",this.second_tag)
               .set("minimumTag",this.minumum_tag)
               .set("image_file",this.photoFileName)
               .save()
               .then(function(results){
                 alert("パーツを保存しました");
                 alert("部品名: " + this.name);
                 location.reload();
               })
               .catch(function(error){
                 alert("保存できませんでした");
               });
    }
  }

  //固有の部品の更新ページを表示
  show_update(parts_id){

  //INPUTより、name属性のデータを抽出
  var parts_id = parts_id.name;

  //データを降順で取得します
  //必要なデータだけを取得できるようにする
  SaveParts.order("createDate",true)
           .equalTo("objectId",parts_id)
           .fetchAll()
           .then(function(results){
              this.name = results[0].name;
              this.minumum_tag = results[0].minumum_tag;
              this.number = results[0].number;
              this.first_tag = results[0].first_tag;
              this.second_tag = results[0].second_tag;
              this.photoFileName = results[0].photoFileName;
              onShowUpdateParts();
           })
           .catch(function(error){
             alert("検索に失敗しました: " +error);
           })
  }

  //固有の部品の更新ページを表示
  show_updatePage(){
  $("#UpdateName").empty();
  $("#UpdateBox").empty();

  $.mobile.changePage("#UpdatePartsPage")
  var name = this.name;
  var data_url = onDownloadFileBtn(this.photoFileName,'updatePhoto');

  $("#UpdateName").append(`<input type="text" id="parts_update_name" placeholder="${name}">`).trigger("create");
  show_select_box("select_number");
  $("#UpdateBox").append(`<input href="#" onclick="onUpdateParts(this);" type="button" data-inline="false" data-theme="b" name="${parts_data.get("objectId")}" value="更新">`).trigger("create");
  }
}
