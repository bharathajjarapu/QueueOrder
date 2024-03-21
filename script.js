const menu_container = document.getElementById('menu');
const order_tbl = document.getElementById('order-tbl');
const total_price_lbl = document.getElementById('total-price');
const menu = [
  {
    name: "Chicken Biryani",
    price: 180
  },
  {
    name: "Haleem",
    price: 100
  },
  {
    name: "Chicken 65",
    price: 100
  },
  {
    name: "Pesarattu Dosa",
    price: 25
  },
  {
    name: "Double ka Meetha",
    price: 20
  },
  {
    name: "Pizza",
    price: 100
  },
  {
    name: "Burger",
    price: 80
  },
  {
    name: "Spaghetti",
    price: 200
  },
];

class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(element) {
    this.items.push(element);
  }

  dequeue() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items.shift();
  }

  isEmpty() {
    return this.items.length === 0;
  }
}

const order_queue = new Queue();
function updateOrderList() {
    let str = "";
    let totalPrice = 0;
  
    if (!order_queue.isEmpty()) {
      str += '<tr>';
      str += '<th>#</th>';
      str += '<th>Name</th>';
      str += '<th>Quantity</th>';
      str += '<th>Action</th>';
      str += '</tr>';
  
      order_queue.items.forEach((item, index) => {
        const menuItem = menu[item.id];
        const itemPrice = menuItem.price * item.quantity;
        totalPrice += itemPrice;
  
        str += '<tr>';
        str += '<td>' + (index + 1) + '</td>';
        str += '<td>' + menuItem.name + '</td>';
        str += '<td>' + item.quantity + '</td>';
        str += '<td><a class="del-btn" href="javascript:void(0)" onclick="deleteItem(' + index + ')"><i class="fa fa-trash-o" aria-hidden="true"></i></a></td>';
        str += '</tr>';
      });
  
      str += '<tr>';
      str += '<td colspan="3" style="text-align: right;"><strong>Total Price:</strong></td>';
      str += '<td>₹' + totalPrice + '</td>';
      str += '</tr>';
      
      document.getElementById('pdf-download-btn').disabled = false;
    } else {
      str += '<tr>';
      str += '<td style="text-align: center" colspan="4">Your order list is empty please select atleast one item </td>';
      str += '</tr>';
      
      document.getElementById('pdf-download-btn').disabled = true;
    }
    order_tbl.innerHTML = str;
  }  

function addItem(id) {
  const qty = document.getElementsByClassName('qty')[id];
  const qty_val = Number(qty.value);

  let found = false;
  order_queue.items.forEach((item) => {
    if (item.id === id) {
      item.quantity += qty_val;
      found = true;
    }
  });

  if (!found) {
    order_queue.enqueue({ id: id, quantity: qty_val });
  }

  updateOrderList();
}

function deleteItem(id) {
  order_queue.items.splice(id, 1);
  updateOrderList();
}

function initApp() {
  for (let i = 0; i < menu.length; i++) {
    let str = '<div class="menu-item">';
    str += '<p class="food-name">' + menu[i].name + '</p>';
    str += '<p class="price">' + (menu[i].price == 0 ? 'Free' : menu[i].price +'₹') + '</p>';
    str += '<input class="qty" type="number" name="qty" value="1" min="1" max="100" >';
    str += '<button class="add-btn" type="button" value="' + i + '" onclick="addItem(' + i +')">ADD</button>';
    str += '</div>';
    menu_container.insertAdjacentHTML('beforeend', str);
  }
  updateOrderList();
}

function generatePDF() {
  if (!order_queue.isEmpty()) {
    const content = document.getElementById('order-tbl');
    const options = {
      margin: 10,
      filename: 'food_orders.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };

    html2pdf().from(content).set(options).save();
  }
}

function cancelOrder() {
  if (!order_queue.isEmpty()) {
    order_queue.dequeue();
    updateOrderList(); 
  }
}

document.getElementById('pdf-download-btn').addEventListener('click', generatePDF);
document.getElementById('cancel-order-btn').addEventListener('click', cancelOrder);

initApp();
