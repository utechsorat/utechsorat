$(document).ready(() => {
    $('.factor-delete').on('click', (e) => {
        $target = $(e.target);
        $.ajax({
            type: 'DELETE',
            url: '/factors/delete/'+$target.attr('data-factor-id'),
            success: (response) => {
                alert('Factor Removed');
                window.location.href = '/'
            },
            error: (error) => {
                console.log(error);
            }
        });
    });
});

