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


Code hoàn chỉnh:

```
import heapq

def heuristic(a, b):
    # Hàm heuristic: khoảng cách Manhattan
    return abs(a[0] - b[0]) + abs(a[1] - b[1])

def a_star(grid, start, goal):
    rows, cols = len(grid), len(grid[0])
    open_set = []  # hàng đợi ưu tiên
    heapq.heappush(open_set, (0, start))  # (f_score, node)
    
    came_from = {}  # để truy vết đường đi
    g_score = {start: 0}

    while open_set:
        _, current = heapq.heappop(open_set)

        if current == goal:
            # Truy vết lại đường đi
            path = []
            while current in came_from:
                path.append(current)
                current = came_from[current]
            path.append(start)
            path.reverse()
            return path

        for dx, dy in [(-1,0),(1,0),(0,-1),(0,1)]:
            neighbor = (current[0]+dx, current[1]+dy)

            if 0 <= neighbor[0] < rows and 0 <= neighbor[1] < cols:
                if grid[neighbor[0]][neighbor[1]] == 1:
                    continue  # không đi vào tường

                tentative_g_score = g_score[current] + 1

                if neighbor not in g_score or tentative_g_score < g_score[neighbor]:
                    came_from[neighbor] = current
                    g_score[neighbor] = tentative_g_score
                    f_score = tentative_g_score + heuristic(neighbor, goal)
                    heapq.heappush(open_set, (f_score, neighbor))

    return None  # không tìm được đường


grid = [
  [0, 0, 0, 0, 0],
  [0, 1, 1, 1, 0],
  [0, 0, 0, 0, 0],
  [1, 1, 0, 1, 0],
  [0, 0, 0, 0, 0]
]

start = (0, 0)
goal = (4, 4)

path = a_star(grid, start, goal)

if path:
    print("Tìm được đường đi:")
    for step in path:
        print(step)
else:
    print("Không tìm được đường.")



```
# Giờ thêm trọng số để cải thiện khả năng trong thực tế

- 1 là đường đi bình thường( chi phí thấp)
- 99 là đường đi khó khắn ( chi phí cao hơn)

- ma trận giả tưởng:
  
```
grid = [
  [1, 1, 1, 1, 1],
  [1, 99, 99, 99, 1],
  [1, 1, 1, 1, 1],
  [99, 99, 1, 99, 1],
  [1, 1, 1, 1, 1]
]
```

- code toàn bộ:
```
import heapq

def a_star(grid, start, goal):
    rows, cols = len(grid), len(grid[0])
    open_set = []
    heapq.heappush(open_set, (0, start))
    came_from = {}
    g_score = {start: 0}

    def heuristic(a, b):
        return abs(a[0] - b[0]) + abs(a[1] - b[1])  # Manhattan distance

    while open_set:
        _, current = heapq.heappop(open_set)

        if current == goal:
            # reconstruct path
            path = []
            while current in came_from:
                path.append(current)
                current = came_from[current]
            path.append(start)
            path.reverse()
            return path

        x, y = current
        for dx, dy in [(-1,0),(1,0),(0,-1),(0,1)]:
            nx, ny = x + dx, y + dy
            neighbor = (nx, ny)
            if 0 <= nx < rows and 0 <= ny < cols and grid[nx][ny] < 99:
                tentative_g = g_score[current] + grid[nx][ny]
                if neighbor not in g_score or tentative_g < g_score[neighbor]:
                    g_score[neighbor] = tentative_g
                    f = tentative_g + heuristic(neighbor, goal)
                    heapq.heappush(open_set, (f, neighbor))
                    came_from[neighbor] = current

    return None  # no path found
grid = [
  [1, 1, 1, 1, 1],
  [1, 99, 99, 99, 1],
  [1, 1, 1, 1, 1],
  [99, 99, 1, 99, 1],
  [1, 1, 1, 1, 1]
]

start = (0, 0)
goal = (4, 4)
path = a_star(grid, start, goal)

if path:
    print("Đường đi được tìm thấy:")
    for step in path:
        print(step)
else:
    print("Không tìm thấy đường đi.")

```
- Kết quả:

![image](https://github.com/user-attachments/assets/1af15230-3e90-4884-b883-572816acf41f)


## Hướng phát triển:

- Tích hợp bản đồ thực tế với IOT:
Dùng camera + Lidar để quét môi trường và tạo ma trận bản đồ tự động (gọi là occupancy grid trong ROS).

Giá trị có thể là:

 - 0: vùng trống

 - 1: vật cản

 - -1: chưa biết

- Ví dụ:

```
grid = [
  [0, 0, 0, 1, 1],
  [0, -1, 0, 0, 0],
  [1, 1, 0, -1, 0],
  ...
]


```
- Các yếu tố cải thiện ngoại quan:

- Thời gian cập nhật bản đồ theo thời gian thực (dùng sensor)

- Khu vực đông người → tăng trọng số di chuyển

- Lập bản đồ động (SLAM) khi robot vừa đi vừa vẽ bản đồ

- Định hướng di chuyển (heading) nếu robot không thể xoay nhanh hoặc không quay đầu lại.

