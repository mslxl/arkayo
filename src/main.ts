import UI_XML from 'raw-loader!./ui.xml'
import * as logger from './logger'
import * as capture from './capture'
let androidx = Packages.androidx;


function renderUI(u: any, uiXml: string, data: any) {
  let rg = /\[\[(.*)\]\]/gm
  let xml = uiXml
  uiXml.match(rg)
    ?.map(e => e.substring(e.lastIndexOf('[') + 1, e.indexOf(']')))
    ?.forEach((e) => {
      if (typeof (data[e]) != 'undefined') {
        if ((typeof (data[e]) == 'object') && data[e] instanceof Array) {
          let i = (data[e] as any[]).reduce((pre, acc) => pre + '|' + acc)
          xml = xml.replace(`\[\[${e}\]\]`, i)
        } else {
          xml = xml.replace(`\[\[${e}\]\]`, data[e])
        }
      } else {
        logger.trace(`No data named ${e} referred in ui xml`)
      }
    })
  u.layout(xml)
}

function buildMenuItem(menu: any, title: string, icon: any) {
  let menuItem = menu.add(title)
  menuItem.setIcon(icon)
  return menuItem
}

function initConsole(u: any) {
  u.console.setConsole(runtime.console);
  u.console.input.setTextColor(colors.BLACK);
  u.console.setInputEnabled(false);
  u.console.setColor("D", "#000000")
  let menuItems: any[] = [];
  let menu = u.nav.menu;
  menuItems.push(buildMenuItem(menu, 'Control', u.R.drawable.ic_build_black_48dp));
  menuItems.push(buildMenuItem(menu, 'Console', u.R.drawable.ic_description_black_48dp));

  u.nav.setOnNavigationItemSelectedListener(function (item: any) {
    u.pager.currentItem = menuItems.indexOf(item);
    return true;
  });

  ui.pager.addOnPageChangeListener(new androidx.viewpager.widget.ViewPager.OnPageChangeListener({
    onPageSelected: function (position: number) {
      menuItems[position].setChecked(true);
    }
  }));
}

function initUI(u: any) {
  renderUI(u, UI_XML, {
    task: ['ww', 'aa']
  })
  initConsole(u)
  u.cbConsole.on('check', (checked: boolean) => {
    logger.setEnable(checked)
  })
  u.btnLaunch.on('click', () => {
    threads.start(() => {
      capture.requestPermission()
    })
  })
}

initUI(ui)

logger.v('Initialized successfully')