$(function() {
    $(".show-menu").sideNav();

    $('ul.tabs').tabs({ "swipeable" : true });

    $('#tabletennis-datatable').DataTable( {
        columnDefs: [
            {
                targets: [ 0, 1, 2 ],
                className: 'mdl-data-table__cell--non-numeric'
            }
        ]
    } );
});