function Tabza(selector, options) {
  // Option mặc định
  const defaultOptions = {
    activeTab: null, // Tab mặc định được chọn là tab thứ hai (bắt đầu từ 0)
    activeClass: null, // đặt class cho tab-item ở trạng thái active
    useLS: true, // Mặc định bật lưu trạng thái vào localStorage
    action: () => {},
  };

  this.opt = Object.assign({}, defaultOptions, options);
  this.currentTabIndex = null; // Khởi tạo chỉ số tab hiện tại ban đầu

  // Kiểm tra và khởi tạo Tabza nếu đủ điều kiện
  if (selector) {
    this.init(selector);
  } else {
    console.error(
      "Tabza Error: The first parameter must be a valid selector for the tab container."
    );
  }
}

// METHOD INIT TAB
Tabza.prototype.init = function (selector) {
  //  Lấy ra tabContainer
  const tabContainer = document.querySelector(selector);
  if (!tabContainer) {
    console.error("Tabza Error: Invalid tab container selector.");
    return;
  }
  this._tabContainer = [...tabContainer.children];

  // Kiểm tra tabContainer có đủ tab-list và tab-panel chưa?
  if (tabContainer.children.length < 2) {
    console.error(
      "Tabza Error: The tab container must contain at least 2 child elements."
    );
    return;
  }

  // Tạo biến lưu trữ phần tử tab-list và tab-panels
  const [tabList, tabPanels] = this._tabContainer;

  if (tabList && tabPanels) {
    // Kiểm tra số lượng tab-list và tab-panel có bằng nhau không?
    if (tabList.children.length !== tabPanels.children.length) {
      console.error(
        'Tabza Error: The number of child elements in the "Tab List" and the "Tab Panels" must match.'
      );
      return;
    }

    // Khai báo và lưu trữ các phần tử con của tab-list và tab-panels
    this._tabItems = [...tabList.children]; // Lưu danh sách các tab-item
    this._panels = [...tabPanels.children]; // Lưu danh sách các panel

    // Lắng nghe sự kiện click trên tab-list
    tabList.addEventListener("click", (event) => {
      const clickedTab = event.target.closest("button, a, [data-tab]"); // Tìm 1 trong 3
      if (clickedTab) {
        const index = this._tabItems.indexOf(clickedTab);

        this._handleActiveTab(index);

        // Nếu `useLocalStorage` được bật, lưu trạng thái tab vào localStorage
        if (this.opt.useLS) {
          this._updateLS(index);
        }
      }
    });
  }

  // Lấy trạng thái tab từ localStorage hoặc mặc định
  let activeTabIndex = 0;
  if (this.opt.useLS) {
    const savedTabIndex = this._getTabIndex();
    activeTabIndex =
      savedTabIndex !== null ? savedTabIndex : this.opt.activeTab ?? 0;
  } else {
    activeTabIndex = this.opt.activeTab ?? 0;
  }

  // Kích hoạt tab dựa trên trạng thái
  this._handleActiveTab(activeTabIndex);
};

// FUNCTION Lấy key cho localStorage dựa trên selector
Tabza.prototype._getLSKey = function () {
  return `Tabza-active-${
    this._tabContainer[0].parentNode.id ||
    this._tabContainer[0].parentNode.className
  }`;
};

// FUNCTION Lấy index của tab đã lưu từ localStorage
Tabza.prototype._getTabIndex = function () {
  const key = this._getLSKey();
  const savedIndex = localStorage.getItem(key);
  return savedIndex !== null ? +savedIndex : null;
};

// FUNCTION Lưu trạng thái index của tab vào localStorage
Tabza.prototype._updateLS = function (index) {
  const key = this._getLSKey();
  localStorage.setItem(key, index);
};

// HANDLE HIDE ALL TAB
Tabza.prototype._hideAllTab = function () {
  this._panels.forEach((panel) => {
    panel.hidden = true;
  });
};

// HANDLE SHOW TAB ACTIVE
Tabza.prototype._showPanel = function (index) {
  if (this._panels[index]) {
    this._panels[index].hidden = false;
  }
};

// METHOD ACTIVE TAB
Tabza.prototype._handleActiveTab = function (index) {
  const prevIndex = this.currentTabIndex; // Tab trước đó (nếu chưa có, sẽ là null)
  const nextIndex = index; // Tab hiện tại người dùng chọn

  // Gọi callback onTabChange nếu được định nghĩa
  if (typeof this.opt.action === "function") {
    this.opt.action(
      prevIndex, // Tab trước đó
      nextIndex, // Tab hiện tại
      this._tabItems[prevIndex] || null, // Tab-item trước đó
      this._tabItems[nextIndex], // Tab-item hiện tại
      this._panels[prevIndex] || null, // Panel trước đó
      this._panels[nextIndex], // Panel hiện tại
      this._tabContainer // Tab container
    );
  }

  // Cập nhật tab hiện tại
  this.currentTabIndex = nextIndex;

  // Thực hiện các logic khác như kích hoạt tab, hiển thị panel
  const [tabList, tabPanels] = this._tabContainer;
  if (tabList && tabPanels) {
    // Loại bỏ trạng thái active khỏi tất cả các tabs
    this._tabItems.forEach((tabItem) => {
      tabItem.classList.remove(this.opt.activeClass);
    });

    // Ẩn tất cả các panels
    this._hideAllTab();

    // Hiển thị tab và panel được chọn
    this._tabItems[index].classList.add(this.opt.activeClass);

    this._showPanel(index);
  }
};
