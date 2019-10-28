$(document).ready(function() {
  $('.addFriendButton').click(function() {
    const receiver = $(this).attr('id').replace('addFriendButtonFor', '');

    axios.post(`/account/send-friend-request`, {
      receiver
    }).then(() => {
      $(this).css('display', 'none');
      $(`#requestSentButtonFor${receiver}`).css('display', 'block');
      socket.emit('send friend request', receiver)
    });
  })

  //
  $('.requestSentButton').mouseenter(function() {
    $(this).removeClass('btn-outline-primary').addClass('btn-outline-danger');
    $(this).find('span').text('Cancel Request')
  }).mouseleave(function() {
    $(this).removeClass('btn-outline-danger').addClass('btn-outline-primary');
    $(this).find('span').text('Request Sent')
  })

  $('.requestSentButton').click(function() {
    const receiver = $(this).attr('id').replace('requestSentButtonFor', '');

    axios.delete(`/account/delete-friend-request/${receiver}`).then(() => {
      $(this).css('display', 'none');
      $(`#addFriendButtonFor${receiver}`).css('display', 'block');
      socket.emit('delete friend request', receiver)
    });
  })

  //
  $('.friendshipButton').mouseenter(function() {
    $(this).removeClass('btn-outline-primary').addClass('btn-outline-danger');
    $(this).html(
      `
      <i class="fas fa-user-times"></i>
      <span>Unfriend</span>
      `
    )
  }).mouseleave(function() {
    $(this).removeClass('btn-outline-danger').addClass('btn-outline-primary');
    $(this).html(
      `
      <i class="fas fa-user-check"></i>
      <span>Friend</span>
      `
    )
  });

  $('.friendshipButton').click(function() {
    const receiver = $(this).attr('id').replace('friendsWith', '');

    axios.delete(`/account/unfriend/${receiver}`).then(() => {
      $(this).css('display', 'none');
      $(`#addFriendButtonFor${receiver}`).css('display', 'block');
      socket.emit('unfriend', receiver);
    })
  })

})