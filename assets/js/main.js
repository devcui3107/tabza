document.addEventListener("DOMContentLoaded", function () {
  // DEMO 1
  const tabDemo1 = new Tabza("#tabs-demo-1", {
    activeTab: 2, // Tab mặc định được chọn là tab thứ hai (bắt đầu từ 0)
    activeClass: "custom-active",
    useLS: true,
    // useHash: true,
  });

  const tabDemo2 = new Tabza("#tabs-demo-2", { activeClass: "custom-active" });
  const tabDemo3 = new Tabza("#tabs-demo-3", { activeClass: "custom-active" });
  const tabDemo4 = new Tabza("#tabs-demo-4", { activeClass: "custom-active" });
});
