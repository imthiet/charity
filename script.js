document
  .getElementById("donation-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    let name = document.getElementById("name").value;
    let amount = document.getElementById("amount").value;
    let phone = document.getElementById("phone").value;
    let note = document.getElementById("note").value;

    if (!name || !amount || !phone) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    let data = {
      name: name,
      amount: amount,
      phone: phone,
      note: note,
    };

    console.log("Dữ liệu gửi đi:", data); // Kiểm tra dữ liệu trước khi gửi

    fetch(
      "https://script.google.com/macros/s/AKfycbzjYynnuPn4yTlO4y_64zShrOhgSMR076oMP4ecXpFDJaCxjfuByEULZ0wyeYrmm6ZR/exec",
      {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    )
      .then((response) => response.text())
      .then((result) => {
        console.log("Phản hồi từ server:", result);
        alert("Gửi xác nhận thành công! Cảm ơn bạn đã ủng hộ.");
        document.getElementById("donation-form").reset();
      })
      .catch((error) => console.error("Lỗi gửi dữ liệu:", error));
  });
function copyToClipboard(elementId) {
  let text = document.getElementById(elementId).innerText;

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Đã sao chép: " + text);
      })
      .catch((err) => {
        console.error("Lỗi sao chép: ", err);
      });
  } else {
    let textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    alert("Đã sao chép: " + text);
  }
}
