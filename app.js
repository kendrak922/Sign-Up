'use strict';
$(document).ready(function () {


  var firebaseConfig = {
      apiKey: "AIzaSyAj_PWrOTX-ywI3RTU4kFQzX2Nrw7_OEvI",
      authDomain: "volunteer-dev-3ced0.firebaseapp.com",
      databaseURL: "https://volunteer-dev-3ced0.firebaseio.com/",
      projectId: "volunteer-dev-3ced0",
      storageBucket: "volunteer-dev-3ced0.appspot.com",
      messagingSenderId: "607646295816",
      appId: "1:607646295816:web:8c546b0a17b4110c992ebd",
      measurementId: "G-EXFJJDYCW1"
  }
  // Initialize Firebase

  firebase.initializeApp(firebaseConfig);
  const database = firebase.database();
  const auth = firebase.auth();
  M.AutoInit();

  let count = 2;
  //display count
  // firebase.database().ref().on('value', function (snapshot) {
  //   count = snapshot.val().firstShift
  //   $('#clickValue').html(count);
  // })






  const tableHTML = `<table class='highlight centered'>
<thead>
    <tr>
        <th>Date</th>
        <th>Time</th>
        <th></th>
    </tr>
</thead>
<tbody>
    <tr>
        <td><span class='today'></span></td>
        <td class='shift' shift=1>10:30am - 12:30pm</td>
        <td class='shifts-available'>
        <span id='clickValue'><p></p></span>
        </td>
    </tr>
    <tr>
        <td></td>
        <td class='shift' shift=2>12:30pm - 2:30pm</td>
        <td class='shifts-available'></td>
    </tr>
    <tr>
        <td></td>
        <td class='shift' shift=3>2:30am - 4:30pm</td>
        <td class='shifts-available'></td>
    </tr>
    <tr>
        <td></td>
        <td class='shift' shift=4>4:30am - 6:30pm</td>
        <td class='shifts-available'></td>
    </tr>
</tbody>
</table>`



  //clone table and add date
  for (let i = 0; i < 8; ++i) {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ]
    // Increment current date by day * i
    const newDate = new Date(Date.now() + (1000 * 60 * 60 * 24 * i));
    const d = newDate.getDate()
    const y = newDate.getFullYear()
    const monthIndex = newDate.getMonth()
    const monthName = months[monthIndex]
    const formatted = `${monthName} ${d}, ${y}`
    $(tableHTML).appendTo('.home');
    $('.today').eq(i).html(formatted);
  }

  $('.shifts-available').append(`<a class='waves-effect btn modal-trigger signup1' data-target='modal1'>Sign Up</a>`)
  $(`<div class='valign-wrapper'> <a class='waves-effect waves-light btn-small right-align admin-button modal-trigger' data-target='modal2' id='sign-in-modal'>Admin Login</a></div>`).appendTo('.home');
  $(`<div class='valign-wrapper'><a href="./admin.html" class='waves-light btn-small hide' id='roster'>View Roster</a><a href="#!" class="waves-effect waves-light btn-small hide" id='btn-logout'>Log Out</a></div>`).appendTo('.home');


  $('.signup1').on('click', function () {
    let shift = $(this).closest('tr').find('.shift').attr("shift");
    console.log(shift)
    let date = $(this).closest('tbody').eq(0).eq(0).find('.today').text();
    let dateFormat = Date.parse(date)
    $('.modal').data('shift', shift);
    $('.modal').data('date', dateFormat);
  });
  
  //cancel button
  $('.cancel').on('click', function () {
    $('#name').val('');
    $('#phone').val('');
    $('#email').val('');
    $('.modal').data('shift', '')
    $('.modal').data('date', '')
  })


  //add volunteer shift to database
  let name = '';
  let phone = '';
  let email = '';
  let shift = '';
  let date = '';
  let sortOrder = '';


const today = Date.now() - (1000 * 60 * 60 * 24);
  //add to table
  database.ref().child('/volunteers').orderByChild('sortOrder').startAt(today).on("child_added", function (childSnapshot, prevChildKey) {
  let date = childSnapshot.val().Date
  let formatted = (new Date(date)).toDateString()
  let shift = childSnapshot.val().Shift
function formatShift(shift) {
  if(shift == 1){
    return shift = "10:30am - 12:30pm"
  } else if(shift == 2){
    return shift = "12:30pm - 2:30pm "
  }else if(shift == 3){
    return shift = "2:30pm - 4:30pm"
  }else{
    return shift = "4:30pm - 6:30pm"
  }
}
let formattedShift = formatShift(shift)

    $('#volunteer-roster').append(`<tr class="item"><td class="target-date">${formatted}</td><td>${formattedShift}</td><td>${childSnapshot.val().Name}</td><td>${childSnapshot.val().Phone}</td><td>${childSnapshot.val().Email}</td></tr>`)
  })


  $('.submit').on('click', function (e) {
    let phoneRegex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/
    let emailRegex = /^\S+@\S+\.\S+$/

    name = $('#name').val().trim();
    phone = $('#phone').val().trim();
    email = $('#email').val().trim();
    shift = $('.modal').data('shift').trim();
    date = $('.modal').data('date')



    if ($('#phone').val() === '' || $('#name').val() === '' || $('#email').val() === '') {
      e.preventDefault();
    } else if (!phoneRegex.test(phone)) {
      e.preventDefault()
    } else if (!emailRegex.test(email)) {
      e.preventDefault()
    } else {

      let volunteer = {
        Name: name,
        Phone: phone,
        Email: email,
        Shift: shift,
        Date: date,
        sortOrder: date + shift,
      };


      database.ref().child('volunteers').push(volunteer)

      $('#name').val('');
      $('#phone').val('');
      $('#email').val('');
      $('.modal').data('shift', '')
      $('.modal').data('date', '')
   

      $('.submit').addClass('modal-close')
    }
  })
  var validate = new Bouncer('form', {
    patterns: {
      email: /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*(\.\w{2,})+$/,
      tel: /[-+]?[0-9]*[.,]?[0-9]+/,
    }
  });

  ///authorization
  const btnLogin = document.getElementById('adminSubmit');
  const btnLogOut = document.getElementById('btn-logout');
  const btnRoster = document.getElementById('roster')
  const btnModal = document.getElementById('sign-in-modal')


  btnLogin.addEventListener('click', e => {
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();
    const promise = auth.signInWithEmailAndPassword(email, pass);
    promise.catch(e => console.log(e.message))
  })


  firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
      btnLogOut.classList.remove('hide');
      btnRoster.classList.remove('hide')
      btnModal.classList.add('hide')
    } else {

      btnLogOut.classList.add('hide');
      btnRoster.classList.add('hide')
      btnModal.classList.remove('hide')
      console.log('not logged in')
    }
  })

  btnLogOut.addEventListener('click', e => {
    firebase.auth().signOut();
  })


});