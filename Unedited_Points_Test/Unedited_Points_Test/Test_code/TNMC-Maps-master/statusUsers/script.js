$("#data-table").dataTable({
  "aaData": users,
  "scrollY": 550,
  "paging": false,
  "info": false,
  "order": [[1, "desc"]],
  "columns": [
    { "data": "User",
    "width": "33%"},
    { "data": "Edits",
    "width": "33%"},
    { "data": "Since",
    "width": "33%"}
  ],
  "oLanguage": {
      "sSearch": "Search for Volunteers:"
    },
    "dom": '<"toolbar">frtip'
});

$("div.toolbar").html("<h3 style='float: left; margin-top: 0;font-weight: bold;text-shadow: 0px 1px 1px rgba(255, 255, 255, 0.6);color:#000000'>Volunteer Status</h3>");
