// Save Articles
$(document).on("click", ".btn-save", function () {
    let id = $(this).data("id");
    $.ajax({
        method: "PUT",
        url: "/headline/" + id
    })
        .then(function (data) {
            console.log(data);
            location.reload();
        });
});

// Delete Articles from Saved
$(document).on("click", ".btn-remove", function () {
    let id = $(this).data('id');

    $.ajax({
        method: "PUT",
        url: "/headline/remove/" + id
    })
        .then(function (data) {
            console.log(data);
            location.reload();
        });
});

// Modal with Comments
$(document).on("click", ".btn-view-comments", function () {
    let articleId = $(this).data('id');
    console.log("Article Id: " + articleId);
    // send request to get article's notes if exist
    $.ajax({
        method: "GET",
        url: "/headline/" + articleId
    })
        .then(function(data) {
            // create modal with article id
            $('.modal-content').html(`
                <div class="modal-header">
                    <h5 class="modal-title">${data.headline}.</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <p>Insert Comment: </p>
                    <textarea rows="3" cols="55" name="comment" class="comment-content"></textarea><br>
                    <p>Comments</p>
                    <ul class="list-group"></ul><br>
                </div>
                <div class="modal-footer">
                    <button type="button" data-id="${data._id}" class="btn btn-primary btn-save-comment">Save Comment</button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>`
            );

            console.log("Headline: " + data.headline);
            console.log("Id: " + data.id);
            console.log("Comment: " + data.comment);

            let totalComments = data.comment.length;

            // if there is no note
            if (totalComments == 0) {
                let message = "<small class='text-muted>This article doesn't have any comments yet.</small>";
                $('.modal-body').prepend(message);
            }
            // if there is/are note(s)
            else {
                let comments = data.comment;
                // loop through notes and append to modal
                comments.forEach(comment => {
                    $('.list-group').append(`
                        <li class="list-group-item justify-content-between">
                            <p class="notes">${comment.body}</p>
                            <button style="float:right" class="btn btn-danger btn-delete-comment" data-id="${comment._id}">Delete</button>
                        </li><br>
                    `);
                });
            }

            $('.modal').modal('show');
        });
});

// Save Comment
$(document).on("click", ".btn-save-comment", function () {
    let id = $(this).data('id');
    let content = $('.comment-content').val().trim();

    if (content) {
        $.ajax({
            method: "POST",
            url: "/comment/" + id,
            data: {body: content}
        })
        .then(function(data) {
            console.log(data);
            // clear textarea
            $('.comment-content').val('');
            // hide modal
            $('.modal').modal('hide');
        });
    }
    else {
        $('.comment-content').val('');
        return;
    }
});

// Delete Comment
$(document).on("click", ".btn-delete-comment", function () {
    let id = $(this).data('id');

        $.ajax({
            method: "DELETE",
            url: "/comment/" + id
        })
        .then((data)=>{
            // hide modal
            $('.modal').modal('hide');
        });
});