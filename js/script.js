// js code here
$(function () {
  $("#fadeBtn").click(function () {
    $("#fade").fadeToggle(700, function () {
      console.log("done");
    });
  });
  $("#print").click(function () {
    print();
  });
  // draggable
  $("#draggable").draggable();
  //   dropable
  $("#draggable, #draggable-nonvalid").draggable();
  $("#droppable").droppable({
    accept: "#draggable",
    classes: {
      "ui-droppable-active": "ui-state-active",
      "ui-droppable-hover": "ui-state-hover",
    },
    drop: function (event, ui) {
      $(this).addClass("ui-state-highlight").find("p").html("Dropped!");
    },
  });
  //   Selectable
  $("#selectable").selectable({
    stop: function () {
      var result = $("#select-result").empty();
      $(".ui-selected", this).each(function () {
        var index = $("#selectable li").index(this);
        result.append(" " + (index + 1));
      });
    },
  });
  //   sortable
  $(".column").sortable({
    connectWith: ".column",
    handle: ".portlet-header",
    cancel: ".portlet-toggle",
    placeholder: "portlet-placeholder ui-corner-all",
  });

  $(".portlet")
    .addClass("ui-widget ui-widget-content ui-helper-clearfix ui-corner-all")
    .find(".portlet-header")
    .addClass("ui-widget-header ui-corner-all")
    .prepend("<span class='ui-icon ui-icon-minusthick portlet-toggle'></span>");

  $(".portlet-toggle").on("click", function () {
    var icon = $(this);
    icon.toggleClass("ui-icon-minusthick ui-icon-plusthick");
    icon.closest(".portlet").find(".portlet-content").toggle();
  });
  // Droppable start
  // There's the gallery and the trash
  var $gallery = $("#gallery"),
    $trash = $("#trash");

  // Let the gallery items be draggable
  $("li", $gallery).draggable({
    cancel: "a.ui-icon", // clicking an icon won't initiate dragging
    revert: "invalid", // when not dropped, the item will revert back to its initial position
    containment: "document",
    helper: "clone",
    cursor: "move",
  });

  // Let the trash be droppable, accepting the gallery items
  $trash.droppable({
    accept: "#gallery > li",
    classes: {
      "ui-droppable-active": "ui-state-highlight",
    },
    drop: function (event, ui) {
      deleteImage(ui.draggable);
    },
  });

  // Let the gallery be droppable as well, accepting items from the trash
  $gallery.droppable({
    accept: "#trash li",
    classes: {
      "ui-droppable-active": "custom-state-active",
    },
    drop: function (event, ui) {
      recycleImage(ui.draggable);
    },
  });

  // Image deletion function
  var recycle_icon =
    "<a href='link/to/recycle/script/when/we/have/js/off' title='Recycle this image' class='ui-icon ui-icon-refresh'>Recycle image</a>";
  function deleteImage($item) {
    $item.fadeOut(function () {
      var $list = $("ul", $trash).length
        ? $("ul", $trash)
        : $("<ul class='gallery ui-helper-reset'/>").appendTo($trash);

      $item.find("a.ui-icon-trash").remove();
      $item
        .append(recycle_icon)
        .appendTo($list)
        .fadeIn(function () {
          $item
            .animate({ width: "48px" })
            .find("img")
            .animate({ height: "36px" });
        });
    });
  }

  // Image recycle function
  var trash_icon =
    "<a href='link/to/trash/script/when/we/have/js/off' title='Delete this image' class='ui-icon ui-icon-trash'>Delete image</a>";
  function recycleImage($item) {
    $item.fadeOut(function () {
      $item
        .find("a.ui-icon-refresh")
        .remove()
        .end()
        .css("width", "96px")
        .append(trash_icon)
        .find("img")
        .css("height", "72px")
        .end()
        .appendTo($gallery)
        .fadeIn();
    });
  }

  // Image preview function, demonstrating the ui.dialog used as a modal window
  function viewLargerImage($link) {
    var src = $link.attr("href"),
      title = $link.siblings("img").attr("alt"),
      $modal = $("img[src$='" + src + "']");

    if ($modal.length) {
      $modal.dialog("open");
    } else {
      var img = $(
        "<img alt='" +
          title +
          "' width='384' height='288' style='display: none; padding: 8px;' />"
      )
        .attr("src", src)
        .appendTo("body");
      setTimeout(function () {
        img.dialog({
          title: title,
          width: 400,
          modal: true,
        });
      }, 1);
    }
  }

  // Resolve the icons behavior with event delegation
  $("ul.gallery > li").on("click", function (event) {
    var $item = $(this),
      $target = $(event.target);

    if ($target.is("a.ui-icon-trash")) {
      deleteImage($item);
    } else if ($target.is("a.ui-icon-zoomin")) {
      viewLargerImage($target);
    } else if ($target.is("a.ui-icon-refresh")) {
      recycleImage($item);
    }

    return false;
  });
  // Droppable end

  // resizable start
  $("#resizable").resizable({
    animate: true,
  });
  // resizable end
  // accordion start
  $("#accordion").accordion({
    collapsible: true,
    // heightStyle: "fill",
  });
  var icons = {
    header: "ui-icon-circle-arrow-e",
    activeHeader: "ui-icon-circle-arrow-s",
  };
  $("#accordion").accordion({
    icons: icons,
  });
  $("#toggle")
    .button()
    .on("click", function () {
      if ($("#accordion").accordion("option", "icons")) {
        $("#accordion").accordion("option", "icons", null);
      } else {
        $("#accordion").accordion("option", "icons", icons);
      }
    });
  // accordion end
  // autocomplete start
  var availableTags = [
    "ActionScript",
    "AppleScript",
    "Asp",
    "BASIC",
    "C",
    "C++",
    "Clojure",
    "COBOL",
    "ColdFusion",
    "Erlang",
    "Fortran",
    "Groovy",
    "Haskell",
    "Java",
    "JavaScript",
    "Lisp",
    "Perl",
    "PHP",
    "Python",
    "Ruby",
    "Scala",
    "Scheme",
  ];
  function split(val) {
    return val.split(/,\s*/);
  }
  function extractLast(term) {
    return split(term).pop();
  }

  $("#tags")
    // don't navigate away from the field on tab when selecting an item
    .on("keydown", function (event) {
      if (
        event.keyCode === $.ui.keyCode.TAB &&
        $(this).autocomplete("instance").menu.active
      ) {
        event.preventDefault();
      }
    })
    .autocomplete({
      minLength: 0,
      source: function (request, response) {
        // delegate back to autocomplete, but extract the last term
        response(
          $.ui.autocomplete.filter(availableTags, extractLast(request.term))
        );
      },
      focus: function () {
        // prevent value inserted on focus
        return false;
      },
      select: function (event, ui) {
        var terms = split(this.value);
        // remove the current input
        terms.pop();
        // add the selected item
        terms.push(ui.item.value);
        // add placeholder to get the comma-and-space at the end
        terms.push("");
        this.value = terms.join(", ");
        return false;
      },
    });
  // autocomplete end
  // Checkboxradio start
  // $("input").checkboxradio();
  // Checkboxradio end
  // Datepicker start
  var dateFormat = "mm/dd/yy",
    from = $("#from")
      .datepicker({
        defaultDate: "+1w",
        changeMonth: true,
        numberOfMonths: 3,
      })
      .on("change", function () {
        to.datepicker("option", "minDate", getDate(this));
      }),
    to = $("#to")
      .datepicker({
        defaultDate: "+1w",
        changeMonth: true,
        numberOfMonths: 3,
      })
      .on("change", function () {
        from.datepicker("option", "maxDate", getDate(this));
      });

  function getDate(element) {
    var date;
    try {
      date = $.datepicker.parseDate(dateFormat, element.value);
    } catch (error) {
      date = null;
    }

    return date;
  }

  // Datepicker end
  // dialog start
  var dialog,
    form,
    // From http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#e-mail-state-%28type=email%29
    emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    name = $("#name"),
    email = $("#email"),
    password = $("#password"),
    allFields = $([]).add(name).add(email).add(password),
    tips = $(".validateTips");

  function updateTips(t) {
    tips.text(t).addClass("ui-state-highlight");
    setTimeout(function () {
      tips.removeClass("ui-state-highlight", 1500);
    }, 500);
  }

  function checkLength(o, n, min, max) {
    if (o.val().length > max || o.val().length < min) {
      o.addClass("ui-state-error");
      updateTips(
        "Length of " + n + " must be between " + min + " and " + max + "."
      );
      return false;
    } else {
      return true;
    }
  }

  function checkRegexp(o, regexp, n) {
    if (!regexp.test(o.val())) {
      o.addClass("ui-state-error");
      updateTips(n);
      return false;
    } else {
      return true;
    }
  }

  function addUser() {
    var valid = true;
    allFields.removeClass("ui-state-error");

    valid = valid && checkLength(name, "username", 3, 16);
    valid = valid && checkLength(email, "email", 6, 80);
    valid = valid && checkLength(password, "password", 5, 16);

    valid =
      valid &&
      checkRegexp(
        name,
        /^[a-z]([0-9a-z_\s])+$/i,
        "Username may consist of a-z, 0-9, underscores, spaces and must begin with a letter."
      );
    valid = valid && checkRegexp(email, emailRegex, "eg. ui@jquery.com");
    valid =
      valid &&
      checkRegexp(
        password,
        /^([0-9a-zA-Z])+$/,
        "Password field only allow : a-z 0-9"
      );

    if (valid) {
      $("#users tbody").append(
        "<tr>" +
          "<td>" +
          name.val() +
          "</td>" +
          "<td>" +
          email.val() +
          "</td>" +
          "<td>" +
          password.val() +
          "</td>" +
          "</tr>"
      );
      dialog.dialog("close");
    }
    return valid;
  }

  dialog = $("#dialog-form").dialog({
    autoOpen: false,
    height: 400,
    width: 350,
    modal: true,
    buttons: {
      "Create an account": addUser,
      Cancel: function () {
        dialog.dialog("close");
      },
    },
    close: function () {
      form[0].reset();
      allFields.removeClass("ui-state-error");
    },
  });

  form = dialog.find("form").on("submit", function (event) {
    event.preventDefault();
    addUser();
  });

  $("#create-user")
    .button()
    .on("click", function () {
      dialog.dialog("open");
    });
  // dialog end

  // menu start
  $("#menu").menu();
  // menu end
  // Progressbar start
  var progressbar = $("#progressbar"),
    progressLabel = $(".progress-label");

  progressbar.progressbar({
    value: false,
    change: function () {
      progressLabel.text(progressbar.progressbar("value") + "%");
    },
    complete: function () {
      progressLabel.text("Complete!");
    },
  });

  function progress() {
    var val = progressbar.progressbar("value") || 0;

    progressbar.progressbar("value", val + 2);

    if (val < 99) {
      setTimeout(progress, 80);
    }
  }

  setTimeout(progress, 2000);

  // Progressbar end
  // selectmenu start
  var circle = $("#circle");

  $("#radius").selectmenu({
    change: function (event, data) {
      circle.css({
        width: data.item.value,
        height: data.item.value,
      });
    },
  });

  $("#color").selectmenu({
    change: function (event, data) {
      circle.css("background", data.item.value);
    },
  });
  $("#boxShadow").selectmenu({
    change: function (event, data) {
      circle.css("boxShadow", data.item.value);
    },
  });
  $("#border").selectmenu({
    change: function (event, data) {
      circle.css("border", data.item.value);
    },
  });
  // selectmenu end

  // slider start
  $("#slider-vertical").slider({
    orientation: "vertical",
    range: "min",
    min: 0,
    max: 100,
    value: 60,
    slide: function (event, ui) {
      $("#amount").val(ui.value);
    },
  });
  $("#amount").val($("#slider-vertical").slider("value"));
  // slider end

  // tabs start
  $("#tabs").tabs({
    collapsible: true,
    // event: "mouseover",
  });
  // tabs end
  // tooltip start
  $("#show-option").tooltip({
    show: {
      effect: "slideDown",
      delay: 250,
    },
  });
  $("#hide-option").tooltip({
    hide: {
      effect: "explode",
      delay: 250,
    },
  });
  $("#open-event").tooltip({
    show: null,
    position: {
      my: "left top",
      at: "left bottom",
    },
    open: function (event, ui) {
      ui.tooltip.animate({ top: ui.tooltip.position().top + 10 }, "fast");
    },
  });
  // tooltip end
  // effect start
  // run the currently selected effect
  function runEffect() {
    // get effect type from
    var selectedEffect = $("#effectTypes").val();

    // Most effect types need no options passed by default
    var options = {};
    // some effects have required parameters
    if (selectedEffect === "scale") {
      options = { percent: 50 };
    } else if (selectedEffect === "transfer") {
      options = { to: "#button", className: "ui-effects-transfer" };
    } else if (selectedEffect === "size") {
      options = { to: { width: 200, height: 60 } };
    }

    // Run the effect
    $("#effect").effect(selectedEffect, options, 500, callback);
  }

  // Callback function to bring a hidden box back
  function callback() {
    setTimeout(function () {
      $("#effect").removeAttr("style").hide().fadeIn();
    }, 1000);
  }

  // Set effect from select menu value
  $("#button").on("click", function () {
    runEffect();
    return false;
  });
  // effect
});
