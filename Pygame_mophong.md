# Mô tả bằng pygame

- Sử dung pygame để mô tả bằng giao diện với ý tưởng:
  - Màu đen là các hàng, kệ
  - Vàng: vật cản nhẹ
  - Trắng: các ô free to go
  - Xanh: bắt đầu đi
  - Đỏ: điểm đến cuối cùng

- Code với thư viện pygame, math, random

```
import pygame
import heapq
import math
import random

# --- Settings ---
rows, cols = 20, 20
cell_size = 30
width, height = cols * cell_size, rows * cell_size + 60

# --- Grid data ---
grid = [[1 for _ in range(cols)] for _ in range(rows)]

# Tạo các "kệ hàng" dọc
for i in range(2, 18):
    grid[i][3] = 99
    grid[i][6] = 99
    grid[i][9] = 99
    grid[i][12] = 99
    grid[i][15] = 99

# Vật cản nhẹ
grid[10][4] = 5
grid[10][7] = 5

start = (0, 0)
goal = (19, 19)

# --- Pygame setup ---
pygame.init()
screen = pygame.display.set_mode((width, height))
pygame.display.set_caption("A* Pathfinding in Supermarket")

# --- Colors ---
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
GREY = (200, 200, 200)
BLUE = (0, 0, 255)
GREEN = (0, 255, 0)
RED = (255, 0, 0)
ORANGE = (255, 165, 0)
YELLOW = (255, 255, 0)

font = pygame.font.SysFont(None, 24)




def add_light_obstacles(probability=0.15):
    for x in range(rows):
        for y in range(cols):
            if (x, y) not in [start, goal] and grid[x][y] == 1:
                if random.random() < probability:
                    grid[x][y] = 3  # vật cản nhẹ (kệ hàng dễ đi qua)

def draw_grid(path=None, cost=None):
    screen.fill(WHITE)
    for x in range(rows):
        for y in range(cols):
            rect = pygame.Rect(y * cell_size, x * cell_size, cell_size, cell_size)
            value = grid[x][y]
            if value >= 99:
                pygame.draw.rect(screen, BLACK, rect)
            elif value > 1:
                pygame.draw.rect(screen, YELLOW, rect)
            elif path and (x, y) in path:
                pygame.draw.rect(screen, GREEN, rect)
            elif (x, y) == start:
                pygame.draw.rect(screen, BLUE, rect)
            elif (x, y) == goal:
                pygame.draw.rect(screen, RED, rect)
            else:
                pygame.draw.rect(screen, GREY, rect, 1)

    # Vẽ nút Start
    pygame.draw.rect(screen, ORANGE, (10, height - 50, 100, 40))
    txt = font.render("Start", True, BLACK)
    screen.blit(txt, (35, height - 42))

    # Vẽ nút Reset
    pygame.draw.rect(screen, ORANGE, (120, height - 50, 100, 40))
    txt_reset = font.render("Reset", True, BLACK)
    screen.blit(txt_reset, (145, height - 42))

    # In chi phí nếu có
    if cost is not None:
        cost_text = font.render(f"Cost: {cost:.2f}", True, BLACK)
        screen.blit(cost_text, (240, height - 42))

    pygame.display.flip()


def a_star(grid, start, goal):
    open_set = []
    heapq.heappush(open_set, (0, start))
    came_from = {}
    g_score = {start: 0}

    def heuristic(a, b):
        return math.hypot(a[0] - b[0], a[1] - b[1])

    directions = [(-1, 0), (1, 0), (0, -1), (0, 1),
                  (-1, -1), (-1, 1), (1, -1), (1, 1)]

    while open_set:
        _, current = heapq.heappop(open_set)
        if current == goal:
            path = []
            while current in came_from:
                path.append(current)
                current = came_from[current]
            path.append(start)
            path.reverse()
            total_cost = g_score[goal]
            return path, total_cost

        x, y = current
        for dx, dy in directions:
            nx, ny = x + dx, y + dy
            neighbor = (nx, ny)
            if 0 <= nx < rows and 0 <= ny < cols and grid[nx][ny] < 99:
                move_cost = math.sqrt(2) * grid[nx][ny] if dx != 0 and dy != 0 else grid[nx][ny]
                tentative_g = g_score[current] + move_cost
                if neighbor not in g_score or tentative_g < g_score[neighbor]:
                    g_score[neighbor] = tentative_g
                    f = tentative_g + heuristic(neighbor, goal)
                    heapq.heappush(open_set, (f, neighbor))
                    came_from[neighbor] = current
    return None, None


# --- Main loop ---
running = True
path = None
cost = None
draw_grid(path, cost)

while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

        elif event.type == pygame.MOUSEBUTTONDOWN:
            mx, my = pygame.mouse.get_pos()

            # Click Start
            if 10 <= mx <= 110 and height - 50 <= my <= height - 10:
                path, cost = a_star(grid, start, goal)
                draw_grid(path, cost)

            # Click Reset
            elif 120 <= mx <= 220 and height - 50 <= my <= height - 10:
                for x in range(rows):
                    for y in range(cols):
                        if(grid[x][y] < 99):
                            grid[x][y] = 1 # xoa vat can nhe va duong di
                add_light_obstacles() # them vat can            
                path = None
                cost = None
                draw_grid(path, cost)


pygame.quit()
```

