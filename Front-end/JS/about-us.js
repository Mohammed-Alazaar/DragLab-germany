document.addEventListener('DOMContentLoaded', function () {
  const tabsData = window.tabsData;

  if (!tabsData) {
    console.error('⚠️ window.tabsData is undefined');
    return;
  }

  const tabs = document.querySelectorAll('.about-tab');
  const text = document.getElementById('about-text');
  const image = document.getElementById('about-img')?.querySelector('img');

  const content = {
    vision: {
      img: "/assets/Imgs/Icons/products/img-vision.png",
      icon: "/assets/Imgs/Icons/products/vision-active.png",
      title: tabsData.vision.title,
      sectionHeading: tabsData.vision.sectionHeading,
      subtitle: tabsData.vision.subtitle,
      desc: tabsData.vision.desc
    },
    mission: {
      img: "/assets/Imgs/Icons/products/img-mission.png",
      icon: "/assets/Imgs/Icons/products/mission-active.png",
      title: tabsData.mission.title,
      sectionHeading: tabsData.mission.sectionHeading,
      subtitle: tabsData.mission.subtitle,
      desc: tabsData.mission.desc
    },
    values: {
      img: "/assets/Imgs/Icons/products/img-values.png",
      icon: "/assets/Imgs/Icons/products/values-active.png",
      title: tabsData.values.title,
      sectionHeading: tabsData.values.sectionHeading,
      subtitle: tabsData.values.subtitle,
      desc: tabsData.values.desc
    }
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelector('.about-tab.active')?.classList.remove('active');
      tab.classList.add('active');

      const key = tab.getAttribute('data-tab');
      const iconActive = tab.getAttribute('data-icon-active');
      const tabImg = tab.querySelector('img');
      const c = content[key];

      if (tabImg && c) {
        tabImg.src = iconActive;
        image.src = c.img;
        text.innerHTML = `
  <div class="title-icon">
    <div class="tab-icon-bg">
      <img src="${c.icon}" class="tab-icon">
    </div>
    <h3>${c.sectionHeading}</h3>
  </div>
  <h4>${c.subtitle}</h4>
  <p>${c.desc}</p>
`;

      }
    });
  });
});
