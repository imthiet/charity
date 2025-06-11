# Thuật toán tìm kiếm A* - A Star

Công thức F(m) = G(m) + H(m) min

## A* (Q,S,G,P)

  - Q: Không gian trạng thái
  - S: Trạng thái bắt đầu
  - G: Đích đến
  - P: Hành động
  - c ; giá thành, h : heuristic

Đầu vào: Bài toán tìm kiếm
Đầu ra: Đường đi tới nút đích

Khởi tạo: O <- S (O danh sách các nút mở)
While(O # rỗng) do:
  1. Lấy nút n có f(n) nhỏ nhất khỏi O
  2. If n thuộc G , return ( đường đi tới n)
  3. với mọi m thuộc P(n)
     a. g(m) = g(n) + c(n,m)
     b. f(m) = g(m) + h(m)
     c. thêm m vào O cùng giá trị f(m)
 return : không tìm được lời giải

- Xử lý nút lặp: nếu nút lặp có chi phúi tốt hơn
    - Đưa lại vào danh sách nếu đã mở rộng
    - Cập nhật nút cũ có giá thành tốt hơn nếu đang trong tập biên.    

Ví dụ làm tay:

![image](https://github.com/user-attachments/assets/ba1933c2-eb32-46fc-bdb5-19ec8d9f2c33)


![image](https://github.com/user-attachments/assets/7108fdac-69c8-43ae-8e21-d26718f1627f)


## Code(Python)

- Ta sẽ mô phỏng bản đồ( ở đây là siêu thị) bằng ma trận như dưới với 0: là đường đi được. 1 là vật cản( như tường, kệ):


```

grid = [
  [0, 0, 0, 0, 0],
  [0, 1, 1, 1, 0],
  [0, 0, 0, 0, 0],
  [1, 1, 0, 1, 0],
  [0, 0, 0, 0, 0]
]
```




