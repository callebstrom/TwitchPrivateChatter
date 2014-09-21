window.addEventListener("load", function() {
    $(".textarea-contain").prepend("\
      <div id='chat-autocompleter'>\
        <ul>\
        </ul>\
      </div>");
    var autocompleteList = [];
    var keypressMutex = 0;
    var indexOfAt = 0;

    $(".ember-text-area").keydown(function(e){ //Prevents text area cursor from moving
      switch(e.which) {
          case 38: // Move selection up
            e.preventDefault();
          break;

          case 40: // Move selection down
            e.preventDefault();
          break;
      }
    });

    $(".ember-text-area").keyup(function(e){

      switch(e.which) {

          case 39:
            e.preventDefault();
            var usernameToInsert = $("#chat-autocompleter > ul > li.selected > span").text();
            insertUsername("ember1219", usernameToInsert);
          break

          case 38: // Move selection up
            e.preventDefault();
            moveSelectionUp();
          break;

          case 40: // Move selection down
            e.preventDefault();
            moveSelectionDown();
          break;

          default:
          removeAutoCompleter();
          if($(".ember-text-area").val().indexOf("\@") >= 0) {
          indexOfAt = $(".ember-text-area").val().indexOf("\@");
          var inputName = $(".ember-text-area").val().split(/\@/);
          if(inputName[1] != "" && inputName[1] != null) {
            getUsers(inputName[1]);
          }
          break;
        };
      }
    });

    function moveSelectionUp() {
      var lastIndexOfSelected = $("#chat-autocompleter > ul > li").index( $("#chat-autocompleter > ul > li.selected"));
      if($("#chat-autocompleter > ul > li.selected")[0] == $("#chat-autocompleter > ul > li:first-child")[0]) {  //If selected is top element
        $("#chat-autocompleter > ul > li.selected").removeClass("selected");
        var indexOfLast = $("#chat-autocompleter > ul > li").index( $("#chat-autocompleter > ul > li:last-child"));
        var lastLi = $("#chat-autocompleter > ul > li").get(indexOfLast-1);
        $(lastLi).addClass("selected");
      }

      else {
        $("#chat-autocompleter > ul > li.selected").removeClass("selected");
        var lastIndexOfLi = $("#chat-autocompleter > ul > li").get(lastIndexOfSelected-2);
        $(lastIndexOfLi).addClass("selected");
      }
    }

    function moveSelectionDown() {
      var lastIndexOfSelected = $("#chat-autocompleter > ul > li").index( $("#chat-autocompleter > ul > li.selected"));
      var indexOfLast = $("#chat-autocompleter > ul > li").index( $("#chat-autocompleter > ul > li:last-child"));
      var lastLi = $("#chat-autocompleter > ul > li").get(indexOfLast-1);
      if($("#chat-autocompleter > ul > li.selected")[0] == $(lastLi)[0]) {  //If selected is bottom element
        $("#chat-autocompleter > ul > li.selected").removeClass("selected");
        var indexOfFirst = $("#chat-autocompleter > ul > li").index( $("#chat-autocompleter > ul > li:first-child"));
        var firstLi = $("#chat-autocompleter > ul > li").get(indexOfFirst);
        $(firstLi).addClass("selected");
      }

      else {
        $("#chat-autocompleter > ul > li.selected").removeClass("selected");
        var lastIndexOfLi = $("#chat-autocompleter > ul > li").get(lastIndexOfSelected+2);
        $(lastIndexOfLi).addClass("selected");
      }
    }

    function getUsers(inputName) {
      autocompleteList = [];
      $($(".chat-line > span.from").get().reverse()).each(function() { 
        var username = $(this).text(); 
        if (username.toLowerCase().indexOf(inputName.toLowerCase()) >= 0) {
          autocompleteList.push(username);

          console.debug(autocompleteList.length);
        }
      });
      autocompleteList = removeDuplicatesInPlace(autocompleteList);
      addAutoCompleter();
    }

    function removeAutoCompleter() {
      $("#chat-autocompleter").hide();
    }
    function addAutoCompleter() {
      $("#chat-autocompleter").show();
      $("#chat-autocompleter > ul").empty();
      for(var i = 0; i < autocompleteList.length; i++) {
        $("#chat-autocompleter > ul").append("<li><span>"+autocompleteList[i]+"</span><li>");
      }

      $("#chat-autocompleter > ul > li:first-child").addClass("selected");

      removeEmptyLi();

    }

    function removeEmptyLi() {

      $.each($("#chat-autocompleter > ul > li"), function (index, value) {
        if($(this).has("span")) {
          if(!$(this).has("span").text() || $(this).has("span").text() == "") {
            $(this).hide();
          }
        }
        else {
          $(this).hide();
        }
      });
    }

    function removeDuplicatesInPlace(arr) {
      var i, j, cur, found;
      for (i = arr.length - 1; i >= 0; i--) {
          cur = arr[i];
          found = false;
          for (j = i - 1; !found && j >= 0; j--) {
              if (cur === arr[j]) {
                  if (i !== j) {
                      arr.splice(i, 1);
                  }
                  found = true;
              }
          }
      }
      return arr;
    };

    function insertUsername(areaId,text) {
      var txtarea = document.getElementById(areaId);
      var scrollPos = txtarea.scrollTop;
      var strPos = 0;
      var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ? 
          "ff" : (document.selection ? "ie" : false ) );
      if (br == "ie") { 
          txtarea.focus();
          var range = document.selection.createRange();
          range.moveStart (indexOfAt, -txtarea.value.length);
          strPos = range.text.length;
      }
      else if (br == "ff") strPos = txtarea.selectionStart;

      var front = (txtarea.value).substring(0,strPos);  
      var back = (txtarea.value).substring(strPos,txtarea.value.length); 
      txtarea.value=front+text+back;
      strPos = strPos + text.length;
      if (br == "ie") { 
          txtarea.focus();
          var range = document.selection.createRange();
          range.moveStart (indexOfAt, -txtarea.value.length);
          range.moveStart (indexOfAt, strPos);
          range.moveEnd (indexOfAt, 0);
          range.select();
      }
      else if (br == "ff") {
          txtarea.selectionStart = strPos;
          txtarea.selectionEnd = strPos;
          txtarea.focus();
      }
      txtarea.scrollTop = scrollPos;
    }


}, true);

