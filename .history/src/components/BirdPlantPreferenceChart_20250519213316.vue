<style scoped>
.chart-container {
  height: 600px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
}

h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #1a2d00;
  font-size: 1.5rem;
  font-weight: 700;
}

.bird-selector {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.chart-wrapper {
  flex-grow: 1;
  position: relative;
}

.chart {
  min-height: 400px;
  width: 100%;
}

/* 美化下拉菜单 */
label {
  font-weight: 600;
  color: #1a2d00;
  font-size: 1rem;
}

select {
  padding: 10px 14px;
  border-radius: 6px;
  font-size: 16px;
  border: 2px solid #e2e8f0;
  background-color: white;
  color: #1a2d00;
  cursor: pointer;
  font-weight: 500;
  width: 220px;
  appearance: none; /* 移除默认箭头 */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%231a2d00' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

select:hover {
  border-color: #1a2d00;
  background-color: #f9fafb;
}

select:focus {
  outline: none;
  border-color: #1a2d00;
  box-shadow: 0 0 0 3px rgba(26, 45, 0, 0.2);
}

/* 在下拉菜单打开时增加背景色变化 */
select:active {
  background-color: #f3f9c0;
}

/* 下拉菜单选项样式 - 注意这只影响某些浏览器 */
select option {
  padding: 10px;
  background-color: white;
  color: #374151;
}

select option:checked {
  background-color: #1a2d00;
  color: white;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .bird-selector {
    flex-direction: column;
    align-items: flex-start;
  }

  select {
    width: 100%;
  }
}
</style>
