const TYPE = {
  1: "A",
  2: "NS",
  3: "MD",
  4: "MF",
  5: "CNAME",
  6: "SOA",
  7: "MB",
  8: "MG",
  9: "MR",
  10: "NULL",
  11: "WKS",
  12: "PTR",
  13: "HINFO",
  14: "MINFO",
  15: "MX",
  16: "TXT",
  28: "AAAA",
  33: "SRV",
  41: "EDNS",
  99: "SPF",
  252: "AXFR",
  253: "MAILB",
  254: "MAILA",
  255: "ANY",
  257: "CAA",
};
const CLASS = {
  1: "IN",
  2: "CS",
  3: "CH",
  4: "HS",
  255: "ANY",
};
let row = 0;
socket.on("dns-query", (res) => {
  res.answers.push(...res.questions);
  [...new Set(res.answers)].forEach((d, i) => {
    row++;
    const log = document.createElement("tr");

    const domain = document.createElement("td");
    domain.append(d.domain ?? d.name);

    const clas = document.createElement("td");
    clas.append(CLASS[`${d.class}`]);

    const type = document.createElement("td");
    type.append(TYPE[`${d.type}`]);

    const date = document.createElement("td");
    const toggle = document.createElement("td");

    toggle.id = d.domain ?? d.name;
    let toggleButton = document.createElement("button");
    console.log(d);
    if (!d.address) log.classList.add("question");
    if (!d?.allowed) {
      log.classList.add("table-danger");
      toggleButton.innerText = "Unblock";
      toggleButton.type = "1";
      toggleButton.classList.add("btn", "btn-success");
    } else {
      log.classList.add("table-success");
      toggleButton.type = "0";
      toggleButton.innerText = "Block";
      toggleButton.classList.add("btn", "btn-danger");
    }
    toggleButton.id = `adstate`;
    date.innerText = new Date().toLocaleTimeString();
    toggle.append(toggleButton);
    log.append(date, domain, clas, type, toggle);

    setTimeout(() => {
      document.getElementById("logs")?.prepend(log);
      $(`#adstate`).on("click", async function (ev) {
        ev.preventDefault();
        const domain = $(this).parent().attr("id");
        const type = $(this).attr("type") === "1" ? 1 : 0;
        const elm = $(this).parent().parent();
        if (elm.hasClass("table-danger")) {
          elm.removeClass("table-danger").addClass("table-success");
          $(this).removeClass("btn-success").addClass("btn-danger");
          ev.target.innerText = "Block";
        } else {
          elm.removeClass("table-success").addClass("table-danger");
          $(this).removeClass("btn-danger").addClass("btn-success");
          ev.target.innerText = "Unblock";
        }
        const data = (await axios.post("/api/updatetype", { domain: `${domain}`, type: type })).data.data;
        alert(`${data.domain} has been ${data.type}`);
      });
    }, i + Math.round(Math.random() * 27) + 1000);
  });
});

/* Pagination */
getPagination("#log");

//getPagination('.table-class');
//getPagination('table');

/*					PAGINATION 
		  - on change max rows select options fade out all rows gt option value mx = 5
		  - append pagination list as per numbers of rows / max rows option (20row/5= 4pages )
		  - each pagination li on click -> fade out all tr gt max rows * li num and (5*pagenum 2 = 10 rows)
		  - fade out all tr lt max rows * li num - max rows ((5*pagenum 2 = 10) - 5)
		  - fade in all tr between (maxRows*PageNum) and (maxRows*pageNum)- MaxRows 
		  */

function getPagination(table) {
  var lastPage = 1;
  $("#maxRows")
    .on("change", function runPagination(evt) {
      // $('.paginationprev').html('');						// reset pagination

      lastPage = 1;
      $(".pagination").find("li").slice(1, -1).remove();
      var trnum = 0;
      var maxRows = parseInt($(this).val());

      if (maxRows == 5000) {
        $(".pagination").hide();
      } else {
        $(".pagination").show();
      }

      var totalRows = $(table + " tbody tr").length; // numbers of rows
      $(table + " tr:gt(0)").each(function () {
        // each TR in  table and not the header
        trnum++; // Start Counter
        if (trnum > maxRows) {
          // if tr number gt maxRows

          $(this).hide(); // fade it out
        }
        if (trnum <= maxRows) {
          $(this).show();
        } // else fade in Important in case if it ..
      }); //  was fade out to fade it in
      if (totalRows > maxRows) {
        // if tr total rows gt max rows option
        var pagenum = Math.ceil(totalRows / maxRows); // ceil total(rows/maxrows) to get ..
        //	numbers of pages
        for (var i = 1; i <= pagenum; ) {
          // for each page append pagination li
          $(".pagination #prev")
            .before(
              '<li data-page="' +
                i +
                '">\
                <span>' +
                i++ +
                '<span class="sr-only"></span></span>\
								</li>',
            )
            .show();
        } // end for i
      } // end if row count > max rows
      $('.pagination [data-page="1"]').addClass("active");
      $(".pagination li").on("click", function (evt) {
        evt.stopImmediatePropagation();
        evt.preventDefault();
        var pageNum = $(this).attr("data-page");

        var maxRows = parseInt($("#maxRows").val());

        if (pageNum == "prev") {
          if (lastPage == 1) {
            return;
          }
          pageNum = --lastPage;
        }
        if (pageNum == "next") {
          if (lastPage == $(".pagination li").length - 2) {
            return;
          }
          pageNum = ++lastPage;
        }

        lastPage = pageNum;
        var trIndex = 0;
        $(".pagination li").removeClass("active");
        $('.pagination [data-page="' + lastPage + '"]').addClass("active");
        limitPagging();
        $(table + " tr:gt(0)").each(function () {
          trIndex++;

          if (trIndex > maxRows * pageNum || trIndex <= maxRows * pageNum - maxRows) {
            $(this).hide();
          } else {
            $(this).show();
          }
        });
      });
      limitPagging();
    })
    .val(5)
    .change();
}

function limitPagging() {
  // alert($('.pagination li').length)

  if ($(".pagination li").length > 7) {
    if ($(".pagination li.active").attr("data-page") <= 3) {
      $(".pagination li:gt(5)").hide();
      $(".pagination li:lt(5)").show();
      $('.pagination [data-page="next"]').show();
    }
    if ($(".pagination li.active").attr("data-page") > 3) {
      $(".pagination li:gt(0)").hide();
      $('.pagination [data-page="next"]').show();
      for (let i = parseInt($(".pagination li.active").attr("data-page")) - 2; i <= parseInt($(".pagination li.active").attr("data-page")) + 2; i++) {
        $('.pagination [data-page="' + i + '"]').show();
      }
    }
  }
}

// $(function () {
//   // Just to append id number for each row
//   $("table tr:eq(0)").prepend("<th> ID </th>");

//   var id = 0;

//   $("table tr:gt(0)").each(function () {
//     id++;
//     $(this).prepend("<td>" + id + "</td>");
//   });
// });

