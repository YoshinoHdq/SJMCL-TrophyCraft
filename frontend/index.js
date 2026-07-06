(function () {
  var token = document.currentScript?.dataset?.extensionToken || "";
  if (!token) { throw new Error("Missing extension activation token"); }

  function extensionFactory(api) {
    var React = api.React;
    var C = api.ChakraUI;
    var Box = C.Box, VStack = C.VStack, HStack = C.HStack;
    var Text = C.Text, Badge = C.Badge, Heading = C.Heading;
    var SimpleGrid = C.SimpleGrid, Divider = C.Divider;
    var Flex = C.Flex, Spacer = C.Spacer, Button = C.Button;
    var Tabs = C.Tabs, TabList = C.TabList, Tab = C.Tab;
    var TabPanels = C.TabPanels, TabPanel = C.TabPanel;
    var useToast = C.useToast;

    // Emoji constants
    var E = {
      gp: "\u{1F3AE}", bus: "\u{1F68C}", nb: "\u{1F4D4}",
      sw: "\u2694\uFE0F", ca: "\u{1F4C5}", st: "\u{1F31F}",
      lt: "\u{1F4BB}",
      tr: "\u{1F3C6}", gb: "\u{1F30D}",
      pz: "\u{1F9F0}", rb: "\u{1F916}", kc: "\u{1F51F}",
      fr: "\u{1F525}", da: "\u{1F3AF}", ho: "\u{1F3E0}",
      mn: "\u{1F315}", sc: "\u{1F4DC}", cr: "\u{1F319}",
      su: "\u{1F305}", ms: "\u{1F4AA}", lk: "\u{1F512}",
      ck: "\u2713", qu: "\u{2753}", ct: "\u{1F431}",
      hp: "\u{1F3A7}"
    };

    var categories = [
      ["b", "\u65B0\u624B\u5165\u95E8", E.ct],
      ["ins", "\u5B9E\u4F8B\u7BA1\u7406", E.lt],
      ["e", "\u6269\u5C55\u6536\u96C6", E.pz],
      ["m", "\u91CC\u7A0B\u7891", E.da],
      ["h", "\u9690\u85CF\u6210\u5C31", "\u24C2"]
    ];
    var catMap = {};
    for (var ci = 0; ci < categories.length; ci++) { catMap[categories[ci][0]] = categories[ci]; }

    var achievements = [
      ["f","b","\u521D\u6B21\u542F\u7A0B",E.bus,"\u9996\u6B21\u542F\u52A8Minecraft","\u542F\u52A8\u4EFB\u610F\u6E38\u620F\u5B9E\u4F8B","blue",false,1],
      ["r","b","\u542F\u52A8\u5668\u5C45\u6C11",E.nb,"\u4F7F\u7528\u8D85\u8FC730\u5929","\u7D2F\u8BA1\u4F7F\u752830\u5929","teal",false,30],
      ["v","b","\u767E\u6218\u8001\u5175",E.sw,"\u7D2F\u8BA1\u542F\u52A8100\u6B21","\u7D2F\u8BA1100\u6B21","yellow",false,100],
      ["s3","b","\u8FDE\u7EED\u4E09\u65E5",E.ca,"\u8FDE\u7EED3\u5929\u6253\u5F00\u542F\u52A8\u5668","\u8FDE\u7EED\u767B\u5F553\u5929","green",false,3],
      ["s7","b","\u4E00\u5468\u4F19\u4F34",E.st,"\u8FDE\u7EED7\u5929\u6253\u5F00\u542F\u52A8\u5668","\u8FDE\u7EED\u767B\u5F557\u5929","purple",false,7],
      ["nighthawk","b","\u6DF1\u591C\u8BBF\u5BA2",E.cr,"\u51CC\u66680-3\u70B9\u6253\u5F00\u226510\u6B21","\u6DF1\u591C\u884C\u8005","purple",false,10],
      ["morning","b","\u6668\u578B\u4EBA",E.su,"\u65E9\u66686-9\u70B9\u6253\u5F00\u226510\u6B21","\u6668\u95F4\u884C\u8005","orange",false,10],
      ["triple","b","\u4E00\u65E5\u4E09\u56DE",E.rc,"\u5355\u65E5\u6253\u5F00\u22653\u6B21\u8FBE5\u5929","\u9891\u7E41\u7528\u6237","teal",false,5],      ["mi","ins","\u591A\u5B9E\u4F8B",E.lt,"\u5B89\u88C5\u8D85\u8FC73\u4E2A\u6E38\u620F\u5B9E\u4F8B","\u81F3\u5C113\u4E2A\u5B9E\u4F8B","cyan",false,3],
      ["ext3","e","\u6269\u5C55\u521D\u63A2",E.pz,"\u5B89\u88C53\u4E2A\u6269\u5C55","\u5B89\u88C53\u4E2A\u6269\u5C55","teal",false,3],
      ["ext10","e","\u6269\u5C55\u6536\u96C6\u8005",E.pz,"\u5B89\u88C510\u4E2A\u6269\u5C55","\u5B89\u88C510\u4E2A\u6269\u5C55","purple",false,10],
      ["ext_lp","e","\u63A2\u6D4B\u4E0E\u54E8\u5175",E.rb,"\u540C\u65F6\u5B89\u88C5 Log Probe \u548C Server Sentinel","\u68C0\u6D4B\u5230\u7279\u5B9A\u6269\u5C55","cyan",false,1],
      ["t10","m","\u5341\u6B21\u542F\u7A0B",E.kc,"\u7D2F\u8BA1\u542F\u52A810\u6B21","\u7D2F\u8BA110\u6B21","green",false,10],
      ["t50","m","\u4E94\u5341\u6B21\u542F\u7A0B",E.fr,"\u7D2F\u8BA1\u542F\u52A850\u6B21","\u7D2F\u8BA150\u6B21","orange",false,50],
      ["t500","m","\u4E94\u767E\u6B21\u542F\u7A0B",E.da,"\u7D2F\u8BA1\u542F\u52A8500\u6B21","\u7D2F\u8BA1500\u6B21","red",false,500],
      ["streak30","m","\u6708\u5EA6\u5168\u52E4",E.ca,"\u8FDE\u7EED\u767B\u5F55\u226530\u5929","\u8FDE\u7EED\u767B\u5F55","green",false,30],
      ["sprinter","m","\u51B2\u523A\u738B",E.rn,"\u5355\u65E5\u542F\u52A8\u226515\u6B21","\u6781\u901F\u7528\u6237","red",false,15],      ["d7","m","\u4E00\u5468\u76EE",E.ho,"\u4F7F\u7528\u542F\u52A8\u5668\u6EE17\u5929","\u7D2F\u8BA17\u5929","green",false,7],
      ["d30","m","\u6EE1\u6708",E.mn,"\u4F7F\u7528\u542F\u52A8\u5668\u6EE130\u5929","\u7D2F\u8BA130\u5929","blue",false,30],
      ["d100","m","\u767E\u65E5\u8BB0",E.sc,"\u4F7F\u7528\u542F\u52A8\u5668\u6EE1100\u5929","\u7D2F\u8BA1100\u5929","yellow",false,100],
      ["nm","h","\u591C\u732B\u5B50",E.cr,"\u5728\u51CC\u66680-5\u70B9\u542F\u52A8\u6E38\u620F5\u6B21","\u591C\u884C\u751F\u7269","purple",false,5],
      ["em","h","\u65E9\u8D77\u7684\u5C0F\u9E1F",E.su,"\u5728\u6E05\u66685-8\u70B9\u542F\u52A8\u6E38\u620F5\u6B21","\u6668\u95F4\u884C\u8005","orange",false,5],
      ["mt10","h","\u91CD\u5EA6\u4F7F\u7528\u8005",E.ms,"\u5355\u65E5\u542F\u52A8\u8D85\u8FC710\u6B21","\u5355\u65E510\u6B21\u4EE5\u4E0A","red",false,10],
    ];
    var AK = [];
    for (var ai = 0; ai < achievements.length; ai++) { AK.push(achievements[ai][0]); }


    function newAch() {
      var d = {}; for (var i = 0; i < AK.length; i++) { d[AK[i]] = { u: false, a: null, p: 0 }; } return d;
    }
    function newMeta() {
      return { fs: null, ts: 0, tl: 0, dl: {}, lt: [], cd: 0, lad: null, no: 0, eo: 0, mdo: 0, bestCd: 0 };
    }
    async function rJ(h, n, fb) {
      try {
        var raw = JSON.parse(await h.actions.readFile(n));
        for (var k in fb) { if (raw[k] === undefined) { raw[k] = JSON.parse(JSON.stringify(fb[k])); } }
        return raw;
      }
      catch (e) { return JSON.parse(JSON.stringify(fb)); }
    }
    async function wJ(h, n, d) {
      await h.actions.writeFile(n, JSON.stringify(d));
    }

    async function track(h, ev) {
      var m = await rJ(h, "meta.json", newMeta());
      var n = new Date(), td = n.toISOString().slice(0, 10), ns = n.toISOString();
      if (!m.fs) { m.fs = ns; }
      m.ls = ns;
      if (!m.dl[td]) {
        m.dl[td] = { o: 0, l: 0, fo: ns, lo: ns };
        var y = new Date(); y.setDate(y.getDate() - 1);
        if (m.lad === y.toISOString().slice(0, 10)) { m.cd = (m.cd || 0) + 1; }
        else if (m.lad !== td) { m.cd = 1; }
        m.lad = td;
        if (m.cd > (m.bestCd || 0)) m.bestCd = m.cd;
      }
      if (ev === "launch") {
        m.ts += 1; m.dl[td].o += 1; m.css = ns;
        var hh = n.getHours();
        if (hh >= 0 && hh < 5) m.no = (m.no || 0) + 1;
        if (hh >= 5 && hh < 8) m.eo = (m.eo || 0) + 1;
        if (m.dl[td].o > (m.mdo || 0)) m.mdo = m.dl[td].o;
      }
      await wJ(h, "meta.json", m);
      return m;
    }

    async function check(h, m) {
      var a = await rJ(h, "achievements.json", newAch());
      var ch = false, ns = new Date().toISOString();
      function uk(k) { if (!a[k]) { a[k] = { u: false, a: null, p: 0 }; } if (!a[k].u) { a[k].u = true; a[k].a = ns; ch = true; } }
      function sp(k, v) { if (!a[k]) { a[k] = { u: false, a: null, p: 0 }; } if (a[k].p !== v) { a[k].p = v; ch = true; } }
      if (m.ts >= 1) uk("f");
      if (m.fs) { var du = Math.round((Date.now() - Date.parse(m.fs)) / 86400000) + 1; sp("r", Math.min(du, 30)); if (du >= 30) uk("r"); }
      sp("v", Math.min(m.ts, 100)); if (m.ts >= 100) uk("v");
      var sd = m.cd || 0; sp("s3", Math.min(sd, 3)); if (sd >= 3) uk("s3"); sp("s7", Math.min(sd, 7)); if (sd >= 7) uk("s7");
      
      sp("t10", Math.min(m.ts, 10)); if (m.ts >= 10) uk("t10"); sp("t50", Math.min(m.ts, 50)); if (m.ts >= 50) uk("t50"); sp("t500", Math.min(m.ts, 500)); if (m.ts >= 500) uk("t500");
      if (m.fs) { var du = Math.round((Date.now() - Date.parse(m.fs)) / 86400000) + 1; sp("d7", Math.min(du, 7)); if (du >= 7) uk("d7"); sp("d30", Math.min(du, 30)); if (du >= 30) uk("d30"); sp("d100", Math.min(du, 100)); if (du >= 100) uk("d100"); }
      sp("nm", Math.min(m.no||0, 5)); if ((m.no||0) >= 5) uk("nm"); sp("em", Math.min(m.eo||0, 5)); if ((m.eo||0) >= 5) uk("em"); sp("mt10", Math.min(m.mdo||0, 10)); if ((m.mdo||0) >= 10) uk("mt10");
      try { var il = h.actions.getInstanceList(true); if (il && il.length > 0) { sp("mi", Math.min(il.length, 3)); if (il.length >= 3) uk("mi"); } } catch (e) {}
      try {
        if (m.dl) {
          var nc = 0, mc = 0, td = 0;
          for (var dk in m.dl) {
            if (m.dl[dk] && m.dl[dk].fo) {
              var hh = new Date(m.dl[dk].fo).getHours();
              if (hh >= 0 && hh <= 3) nc++;
              if (hh >= 6 && hh <= 9) mc++;
            }
            if (m.dl[dk] && m.dl[dk].o >= 3) td++;
          }
          sp("nighthawk", Math.min(nc, 10)); if (nc >= 10) uk("nighthawk");
          sp("morning", Math.min(mc, 10)); if (mc >= 10) uk("morning");
          sp("triple", Math.min(td, 5)); if (td >= 5) uk("triple");
        }
        sp("streak30", Math.min(m.cd || 0, 30)); if ((m.cd || 0) >= 30) uk("streak30");
        sp("sprinter", Math.min(m.mdo || 0, 15)); if ((m.mdo || 0) >= 15) uk("sprinter");
      } catch (e) {}
      try {
        var extEls = [];
        var scripts = document.querySelectorAll("script");
        for (var si = 0; si < scripts.length; si++) {
          var txt = scripts[si].textContent || "";
          if (txt.indexOf("registerExtension") >= 0) extEls.push(scripts[si]);
        }
        var extCount = extEls.length;
        sp("ext3", Math.min(extCount, 3)); if (extCount >= 3) uk("ext3");
        sp("ext10", Math.min(extCount, 10)); if (extCount >= 10) uk("ext10");
        var hasLP = false, hasSS = false;
        for (var si = 0; si < extEls.length; si++) {
          var txt = extEls[si].textContent || "";
          if (txt.indexOf("org.yoshino.log_probe") >= 0) hasLP = true;
          if (txt.indexOf("org.yoshino.server_sentinel") >= 0) hasSS = true;
        }
        if (hasLP && hasSS) uk("ext_lp");
      } catch (e) {}
      if (ch) await wJ(h, "achievements.json", a);
      return a;
    }

    function cu(a) { var n = 0; for (var k in a) { if (a[k] && a[k].u) n++; } return n; }

    var PERSONALITY = [
      { k: "morning_sprinter", l: "\u6668\u95F4\u51B2\u523A\u578B", e: "\uD83C\uDF05", d: "\u4F60\u4E60\u60EF\u5728\u65E9\u6668\u6253\u5F00\u542F\u52A8\u5668\uFF0C\u7136\u540E\u8FC5\u901F\u8FDB\u5165\u6E38\u620F\u3002\u52A8\u4F5C\u5E72\u8106\uFF0C\u4E0D\u62D6\u6CE5\u5E26\u6C34\u3002" },
      { k: "morning_regular", l: "\u6668\u95F4\u89C4\u5F8B\u578B", e: "\uD83C\uDF04", d: "\u4F60\u662F\u5178\u578B\u7684\u6668\u95F4\u73A9\u5BB6\uFF0C\u6BCF\u5929\u56FA\u5B9A\u65F6\u95F4\u6253\u5F00\u542F\u52A8\u5668\uFF0C\u98CE\u96E8\u65E0\u963B\u3002\u81EA\u5F8B\u5C31\u662F\u4F60\u7684\u4EE3\u540D\u8BCD\u3002" },
      { k: "night_owl", l: "\u591C\u732B\u51B2\u523A\u578B", e: "\uD83E\uDD86", d: "\u6DF1\u591C\u624D\u662F\u4F60\u7684\u4E3B\u573A\u3002\u542F\u52A8\u4E00\u5F00\uFF0C\u6E38\u620F\u79D2\u8FDB\u3002\u591C\u665A\u7684\u6548\u7387\u603B\u662F\u7279\u522B\u9AD8\u3002" },
      { k: "night_browser", l: "\u591C\u732B\u95F2\u901B\u578B", e: "\uD83C\uDF19", d: "\u6DF1\u591C\u6253\u5F00\u542F\u52A8\u5668\uFF0C\u901B\u901B\u6A21\u7EC4\u5546\u5E97\u3001\u770B\u770B\u66F4\u65B0\u65E5\u5FD7\uFF0C\u53EF\u80FD\u6700\u540E\u4E5F\u6CA1\u542F\u52A8\u6E38\u620F\u2014\u2014\u8FC7\u7A0B\u624D\u662F\u4EAB\u53D7\u3002" },
      { k: "day_frequent", l: "\u65E5\u5149\u9AD8\u9891\u578B", e: "\u2600\uFE0F", d: "\u767D\u5929\u662F\u4F60\u6700\u6D3B\u8DC3\u7684\u65F6\u6BB5\uFF0C\u6253\u5F00\u9891\u7387\u9AD8\u3002\u5DE5\u4F5C\u95F4\u9699\u3001\u5348\u4F11\u65F6\u95F4\uFF0C\u968F\u65F6\u6478\u4E00\u628A\u3002" },
      { k: "evening_ritual", l: "\u9EC4\u660F\u4EEA\u5F0F\u578B", e: "\uD83C\uDF06", d: "\u508D\u665A\u65F6\u5206\uFF0C\u7ED3\u675F\u4E86\u4E00\u5929\u7684\u4E8B\u60C5\uFF0C\u6253\u5F00\u542F\u52A8\u5668\u662F\u4F60\u7684\u56FA\u5B9A\u4EEA\u5F0F\u3002\u6709\u59CB\u6709\u7EC8\u7684\u73A9\u5BB6\u3002" },
      { k: "power_user", l: "\u91CD\u5EA6\u542F\u52A8\u5668\u63A7", e: "\uD83D\uDD25", d: "\u4F60\u4E00\u5929\u80FD\u6253\u5F00\u542F\u52A8\u5668\u5341\u51E0\u4E8C\u5341\u6B21\uFF01\u867D\u7136\u4E0D\u4E00\u5B9A\u6BCF\u6B21\u90FD\u542F\u52A8\u6E38\u620F\uFF0C\u4F46\u542F\u52A8\u5668\u672C\u8EAB\u5C31\u50CF\u4F60\u7684\u7B2C\u4E8C\u4E2A\u684C\u9762\u3002" },
      { k: "balanced", l: "\u5747\u8861\u578B\u73A9\u5BB6", e: "\uD83C\uDFAF", d: "\u4F60\u7684\u4F7F\u7528\u4E60\u60EF\u6CA1\u6709\u660E\u663E\u7684\u504F\u5411\uFF0C\u5404\u4E2A\u65F6\u95F4\u6BB5\u90FD\u53EF\u80FD\u6709\u4F60\u7684\u8EAB\u5F71\u3002\u968F\u6027\u800C\u81EA\u7531\u7684\u73A9\u5BB6\u3002" }
    ];
    function analyzePersonality(meta) {
      if (!meta || !meta.dl) return PERSONALITY[7];
      var dl = meta.dl, hc = {};
      for (var d in dl) { if (dl[d] && dl[d].fo) { var h = new Date(dl[d].fo).getHours(); hc[h] = (hc[h] || 0) + 1; } }
      var n=0,m=0,da=0,e=0;
      for (var h=0;h<24;h++) { var c = hc[h]||0; if (h>=0&&h<5) n+=c; else if (h>=5&&h<8) m+=c; else if (h>=8&&h<18) da+=c; else e+=c; }
      var ps = [{i:0,l:"\u51CC\u6668",c:n},{i:1,l:"\u65E9\u6668",c:m},{i:2,l:"\u767D\u5929",c:da},{i:3,l:"\u508D\u665A",c:e}];
      ps.sort(function(a,b){return b.c-a.c});
      var peakIdx = ps[0].i;
      var days = meta.fs ? Math.round((Date.now()-Date.parse(meta.fs))/86400000)+1 : 0;
      var freq = days > 0 ? (meta.ts||0)/days : 0;
      var md = meta.mdo||0;
      var best = meta.bestCd||0;
      if (md >= 15) return PERSONALITY[6];
      if (peakIdx===1 && freq>=3) return PERSONALITY[0];
      if (peakIdx===1 && best>=7) return PERSONALITY[1];
      if (peakIdx===0 && freq>=3) return PERSONALITY[2];
      if (peakIdx===0) return PERSONALITY[3];
      if (peakIdx===2 && freq>=3) return PERSONALITY[4];
      if (peakIdx===3) return PERSONALITY[5];
      return PERSONALITY[7];
    }




    if (typeof document !== "undefined" && !document.getElementById("ach-styles")) {
      var ss = document.createElement("style");
      ss.id = "ach-styles";
      ss.textContent = [
        "@keyframes achPulse { 0%{box-shadow:0 0 0 0 rgba(99,102,241,0.4)} 70%{box-shadow:0 0 0 10px rgba(99,102,241,0)} 100%{box-shadow:0 0 0 0 rgba(99,102,241,0)} }",
        "@keyframes achGlow { 0%,100%{opacity:0.7;transform:scale(1)} 50%{opacity:1;transform:scale(1.05)} }",
        "@keyframes achBar { from{width:0!important} }",
        "@keyframes achFadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }",
        "@keyframes achToastIn { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }"
      ].join("\n");
      document.head.appendChild(ss);
    }


    var HomeWidgetComponent = function () {
      var host = api.getHostContext();
      var toast = useToast();
      var [st, setSt] = React.useState(null);
      var [showReport, setShowReport] = React.useState(false);

      React.useEffect(function () {
        (async function () {
          try {
            var prevAch = await rJ(host, "achievements.json", newAch());
            var m = await track(host, "launch");
            var a = await check(host, m);
            var newOnes = [];
            for (var k in a) {
              if (a[k] && a[k].u && (!prevAch[k] || !prevAch[k].u)) {
                for (var i = 0; i < achievements.length; i++) {
                  if (achievements[i][0] === k) { newOnes.push(achievements[i]); break; }
                }
              }
            }
            newOnes.forEach(function(ad) {
              toast({
                position: "bottom-right", duration: 4000,
                render: function() {
                  return React.createElement(Box, {
                    bg: "#1A1A1A",
                    border: "2px solid",
                    borderColor: "#6B4A28",
                    borderTopColor: "#8B6A38",
                    borderLeftColor: "#8B6A38",
                    borderBottomColor: "#3A2010",
                    borderRightColor: "#3A2010",
                    borderRadius: "sm",
                    boxShadow: "0 6px 32px rgba(0,0,0,0.7), inset 0 0 8px rgba(0,0,0,0.4)",
                    sx: { animation: "achToastIn 0.35s ease-out" }
                  },
                    React.createElement(HStack, { spacing: 2.5, p: 2, align: "center" },
                      React.createElement(Box, {
                        w: 10, h: 10,
                        bg: "#0D0D0D",
                        border: "2px solid", borderColor: "#FFD700",
                        borderRadius: "sm",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "lg", flexShrink: 0
                      }, ad[3]),
                      React.createElement(VStack, { spacing: 0, align: "start" },
                        React.createElement(Text, { fontSize: "10px", color: "#FFD700", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.5px" }, "\u83B7\u5F97\u6210\u5C31!"),
                        React.createElement(Text, { fontSize: "14px", fontWeight: "bold", color: "white", lineHeight: 1.3 }, ad[2])
                      )
                    )
                  );
                }
              });
            });
            var recent = null;
            if (a) {
              var latest = null;
              for (var k in a) { if (a[k] && a[k].u && a[k].a && (!latest || a[k].a > latest.a)) { latest = { id: k, a: a[k].a }; } }
              if (latest) { for (var i = 0; i < achievements.length; i++) { if (achievements[i][0] === latest.id) { recent = achievements[i]; break; } } }
            }
            setSt({ ul: cu(a), tt: AK.length, ach: a, meta: m, recent: recent });
          } catch (e) { setSt({ ul: 0, tt: AK.length, ach: null, meta: null, recent: null }); }
        })();
      }, []);

      if (!st) {
        return React.createElement(VStack, { p: 4, spacing: 3, align: "center" },
          React.createElement(Box, { w: 10, h: 10, borderRadius: "lg", bg: "gray.700", sx: { animation: "achPulse 2s infinite" } }),
          React.createElement(Text, { fontSize: "sm", color: "gray.500" }, "\u52A0\u8F7D\u4E2D...")
        );
      }

      var pct = st.tt > 0 ? Math.round(st.ul / st.tt * 100) : 0;
      var cp = {};
      for (var ci = 0; ci < categories.length; ci++) { cp[categories[ci][0]] = { t: 0, u: 0 }; }
      for (var ai = 0; ai < achievements.length; ai++) {
        var ad2 = achievements[ai];
        if (!cp[ad2[1]]) cp[ad2[1]] = { t: 0, u: 0 };
        cp[ad2[1]].t++;
        if (st.ach && st.ach[ad2[0]] && st.ach[ad2[0]].u) cp[ad2[1]].u++;
      }

      var barFrom = pct >= 100 ? "yellow.400" : "purple.500";
      var barTo = pct >= 100 ? "orange.400" : "blue.400";

      return React.createElement(VStack, {
        p: 3, spacing: 2.5,
        bg: "gray.800", borderRadius: "xl",
        border: "1px solid", borderColor: "gray.700",
        sx: { animation: "achFadeIn 0.5s ease-out", boxShadow: "0 4px 24px rgba(99,102,241,0.12), inset 0 1px 0 rgba(255,255,255,0.05)" }
      },
        React.createElement(Flex, { align: "center", w: "100%" },
          React.createElement(Box, {
            w: 8, h: 8, borderRadius: "md",
            bgGradient: "linear(to-br, purple.500, blue.500)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "md", mr: 2,
            sx: { animation: "achGlow 3s ease-in-out infinite" }
          }, E.gp),
          React.createElement(VStack, { spacing: 0, align: "start" },
            React.createElement(Text, { fontWeight: "bold", fontSize: "sm", color: "white", lineHeight: 1.2 }, "\u6210\u5C31\u7CFB\u7EDF"),
            React.createElement(Text, { fontSize: "xs", color: pct >= 100 ? "yellow.400" : "gray.400" },
              pct >= 100 ? "\u2605 \u5168\u90E8\u6536\u96C6! \u2605" : st.ul + "/" + st.tt + " \u4E2A\u6210\u5C31"
            )
          ),
          React.createElement(Spacer),
          pct >= 100
            ? React.createElement(Box, { w: 8, h: 8, borderRadius: "full", bgGradient: "linear(to-br, yellow.400, orange.400)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "xs", fontWeight: "bold", color: "white" }, "100%")
            : React.createElement(Text, { fontSize: "lg", fontWeight: "bold", color: "blue.400" }, pct + "%")
        ),
        React.createElement(Box, { w: "100%", h: 2, bg: "gray.700", borderRadius: "full", overflow: "hidden" },
          React.createElement(Box, { h: "100%", bgGradient: "linear(to-r, " + barFrom + ", " + barTo + ")", borderRadius: "full", sx: { width: pct + "%", animation: "achBar 1.2s ease-out" } })
        ),
        React.createElement(Flex, { wrap: "wrap", justify: "center", gap: 1.5 },
          categories.map ? categories.map(function(cat) {
            var c = cp[cat[0]] || { t: 0, u: 0 };
            return React.createElement(VStack, {
              key: cat[0], spacing: 0.25, align: "center",
              opacity: c.u > 0 ? 1 : 0.35,
              sx: { transition: "all 0.3s", filter: c.u > 0 ? "none" : "grayscale(0.8)" }
            },
              React.createElement(Text, { fontSize: "sm", lineHeight: 1.2 }, cat[2]),
              React.createElement(Text, { fontSize: "2xs", color: c.t > 0 && c.u >= c.t ? "yellow.400" : "gray.500", lineHeight: 1.2 }, c.u + "/" + c.t)
            );
          }) : null
        ),
        React.createElement(Divider, { borderColor: "gray.700" }),
        React.createElement(Flex, { align: "center", w: "100%" },
          st.recent
            ? React.createElement(React.Fragment, null,
                React.createElement(Text, { fontSize: "xs", color: "yellow.400", mr: 1 }, E.tr),
                React.createElement(Text, { fontSize: "xs", color: "gray.400", flex: 1, isTruncated: true }, "\u6700\u8FD1: " + st.recent[2])
              )
            : React.createElement(Text, { fontSize: "xs", color: "gray.500" }, "\u6682\u65E0\u89E3\u9501\u8BB0\u5F55"),
          React.createElement(Spacer),
          React.createElement(Button, { size: "xs", variant: "ghost", colorScheme: "purple", zIndex: 1, position: "relative", onClick: function() { try { host.actions.openWindow("/standalone/extension/" + api.identifier + "/achievements", "\u6210\u5C31\u5899"); } catch(e) {} } }, "\u6210\u5C31\u5899")
        )
      );
    };


    var AchievementWallPage = function () {
      var host = api.getHostContext();
      var [st, setSt] = React.useState(null);
      var [showReport, setShowReport] = React.useState(false);

      function achCard(ad) {
        var isUnlocked = st.ach && st.ach[ad[0]] && st.ach[ad[0]].u;
        var progress = st.ach && st.ach[ad[0]] ? st.ach[ad[0]].p : 0;
        var maxP = ad[8];
        return React.createElement(VStack, {
          key: ad[0], p: 3, spacing: 1.5,
          bg: isUnlocked ? "gray.700" : "gray.800",
          borderRadius: "lg",
          border: "1px solid",
          borderColor: isUnlocked ? ad[6] + ".500" : "gray.700",
          opacity: ad[7] && !isUnlocked ? 0.4 : 1,
          sx: { transition: "all 0.3s" }
        },
          React.createElement(Flex, { align: "center", w: "100%" },
            React.createElement(Text, { fontSize: "2xl", mr: 2 }, ad[7] && !isUnlocked ? E.qu : ad[3]),
            React.createElement(VStack, { spacing: 0, flex: 1, align: "start" },
              React.createElement(Text, { fontWeight: "bold", fontSize: "sm" }, ad[7] && !isUnlocked ? "???" : ad[2]),
              React.createElement(Text, { fontSize: "xs", color: isUnlocked ? "gray.400" : "gray.500" },
                ad[7] && !isUnlocked ? "\u9690\u85CF\u6210\u5C31" : ad[4]
              )
            ),
            isUnlocked
              ? React.createElement(Badge, { colorScheme: "green", variant: "solid", fontSize: "2xs" }, E.ck)
              : React.createElement(Badge, { colorScheme: "gray", variant: "outline", fontSize: "2xs" }, maxP > 1 ? progress + "/" + maxP : E.lk)
          ),
          maxP > 1 ? React.createElement(Box, { w: "100%", h: 1, bg: "gray.700", borderRadius: "full", overflow: "hidden" },
            React.createElement(Box, { h: "100%", bg: isUnlocked ? "green.400" : "purple.400", borderRadius: "full", sx: { width: Math.round(progress / maxP * 100) + "%" } })
          ) : null
        );
      }

      React.useEffect(function () {
        (async function () {
          try {
            var m = await rJ(host, "meta.json", newMeta());
            var a = await rJ(host, "achievements.json", newAch());
            setSt({ ach: a, meta: m, ul: cu(a), tt: AK.length });
          } catch (e) { setSt({ ach: null, meta: null, ul: 0, tt: AK.length }); }
        })();
      }, []);

      if (!st) {
        return React.createElement(Flex, { w: "100%", h: "100vh", align: "center", justify: "center" },
          React.createElement(Text, { fontSize: "lg", color: "gray.500" }, "\u52A0\u8F7D\u4E2D...")
        );
      }

      var pct = st.tt > 0 ? Math.round(st.ul / st.tt * 100) : 0;
      var catGroup = {};
      for (var i = 0; i < categories.length; i++) { catGroup[categories[i][0]] = []; }
      for (var i = 0; i < achievements.length; i++) {
        var ad3 = achievements[i];
        if (!catGroup[ad3[1]]) catGroup[ad3[1]] = [];
        catGroup[ad3[1]].push(ad3);
      }

            if (showReport && st && st.ach) {
        var metaRR = st.meta || {};
        var achRR = st.ach || {};
        var p = analyzePersonality(metaRR);
        return React.createElement(Box, {
          w: "100%", minH: "100vh",
          bg: "rgba(0,0,0,0.7)", position: "relative", zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "center",
          p: 4
        },
          React.createElement(Box, { maxW: "600px", w: "100%", bg: "#1A202C", borderRadius: "xl", p: 6, border: "1px solid", borderColor: "gray.700",
            sx: { animation: "achFadeIn 0.3s ease-out" }
          },
            React.createElement(VStack, { spacing: 4, align: "stretch" },
              React.createElement(HStack, { justify: "space-between", align: "center" },
                React.createElement(Heading, { size: "md" }, "\u4F60\u7684\u542F\u52A8\u5668\u4EBA\u683C"),
                React.createElement(Button, { size: "xs", variant: "ghost", colorScheme: "gray",
                  onClick: function() { setShowReport(false); }
                }, "\u5173\u95ED")
              ),
              React.createElement(HStack, { spacing: 4, align: "center" },
                React.createElement(Text, { fontSize: "5xl" }, p.e),
                React.createElement(VStack, { spacing: 0, align: "start" },
                  React.createElement(Text, { fontSize: "sm", color: "gray.400" }, "\u4F60\u662F"),
                  React.createElement(Text, { fontSize: "2xl", fontWeight: "bold", color: "white" }, p.l)
                )
              ),
              React.createElement(Divider, { borderColor: "gray.600" }),
              React.createElement(SimpleGrid, { columns: 2, spacing: 3 },
                React.createElement(VStack, { spacing: 0, align: "start", p: 2, bg: "gray.750", borderRadius: "md" },
                  React.createElement(Text, { fontSize: "2xs", color: "gray.500" }, "\u7D2F\u8BA1\u4F7F\u7528"),
                  React.createElement(Text, { fontSize: "lg", fontWeight: "bold", color: "white" },
                    metaRR.fs ? Math.round((Date.now()-Date.parse(metaRR.fs))/86400000)+1 : 0),
                  React.createElement(Text, { fontSize: "2xs", color: "gray.500" }, "\u5929")
                ),
                React.createElement(VStack, { spacing: 0, align: "start", p: 2, bg: "gray.750", borderRadius: "md" },
                  React.createElement(Text, { fontSize: "2xs", color: "gray.500" }, "\u7D2F\u8BA1\u542F\u52A8"),
                  React.createElement(Text, { fontSize: "lg", fontWeight: "bold", color: "white" }, metaRR.ts || 0),
                  React.createElement(Text, { fontSize: "2xs", color: "gray.500" }, "\u6B21")
                ),
                React.createElement(VStack, { spacing: 0, align: "start", p: 2, bg: "gray.750", borderRadius: "md" },
                  React.createElement(Text, { fontSize: "2xs", color: "gray.500" }, "\u6700\u957F\u8FDE\u7EED"),
                  React.createElement(Text, { fontSize: "lg", fontWeight: "bold", color: "white" }, metaRR.bestCd || 0),
                  React.createElement(Text, { fontSize: "2xs", color: "gray.500" }, "\u5929")
                ),
                React.createElement(VStack, { spacing: 0, align: "start", p: 2, bg: "gray.750", borderRadius: "md" },
                  React.createElement(Text, { fontSize: "2xs", color: "gray.500" }, "\u5355\u65E5\u6700\u9AD8"),
                  React.createElement(Text, { fontSize: "lg", fontWeight: "bold", color: "white" }, metaRR.mdo || 0),
                  React.createElement(Text, { fontSize: "2xs", color: "gray.500" }, "\u6B21")
                ),
                React.createElement(VStack, { spacing: 0, align: "start", p: 2, bg: "gray.750", borderRadius: "md" },
                  React.createElement(Text, { fontSize: "2xs", color: "gray.500" }, "\u89E3\u9501\u6210\u5C31"),
                  React.createElement(Text, { fontSize: "lg", fontWeight: "bold", color: "white" }, st.ul + "/" + st.tt),
                  React.createElement(Text, { fontSize: "2xs", color: "gray.500" }, "\u4E2A")
                ),
                React.createElement(VStack, { spacing: 0, align: "start", p: 2, bg: "gray.750", borderRadius: "md" },
                  React.createElement(Text, { fontSize: "2xs", color: "gray.500" }, "\u5F00\u542F\u65F6\u6BB5"),
                  React.createElement(Text, { fontSize: "lg", fontWeight: "bold", color: "white" },
                    p.k === "morning_sprinter"||p.k==="morning_regular" ? "\u6668\u95F4" :
                    p.k==="night_owl"||p.k==="night_browser" ? "\u6DF1\u591C" :
                    p.k==="day_frequent" ? "\u767D\u5929" :
                    p.k==="evening_ritual" ? "\u508D\u665A" : "\u5747\u5300"),
                  React.createElement(Text, { fontSize: "2xs", color: "gray.500" }, "\u9AD8\u5CF0")
                )
              ),
              React.createElement(Divider, { borderColor: "gray.600" }),
              React.createElement(Text, { fontSize: "sm", color: "gray.300", lineHeight: 1.6 }, p.d),
              React.createElement(Text, { fontSize: "xs", color: "gray.500", textAlign: "center" },
                "\u6570\u636E\u6765\u6E90\u4E8E\u4F60\u7684\u542F\u52A8\u5668\u4F7F\u7528\u8BB0\u5F55\u3002\u6BCF\u6B21\u5206\u6790\u5747\u4E3A\u5B9E\u65F6\u6700\u65B0\u6570\u636E\u3002"
              )
            )
          )
        );
      }

return React.createElement(Box, { p: 4, w: "100%", minH: "100vh", bg: "#1A202C", color: "white", position: "relative", zIndex: 10 },
        React.createElement(VStack, { spacing: 4, align: "stretch", maxW: "800px", mx: "auto" },
          React.createElement(VStack, { spacing: 1, align: "center" },
            React.createElement(Heading, { size: "lg" }, E.gp + " \u542F\u52A8\u5668\u6210\u5C31"),
            React.createElement(Text, { fontSize: "sm", color: "gray.400" }, "\u89E3\u9501 " + st.ul + "/" + st.tt + " \u4E2A\u6210\u5C31 (" + pct + "%)"),
            React.createElement(Box, { w: "100%", maxW: "300px", h: 2, bg: "gray.700", borderRadius: "full", overflow: "hidden" },
              React.createElement(Box, { h: "100%", bgGradient: "linear(to-r, purple.500, blue.400)", borderRadius: "full", sx: { width: pct + "%", transition: "width 0.5s" } })
            )
          ),
          React.createElement(Divider, { borderColor: "gray.700" }),
          React.createElement(Tabs, { variant: "soft-rounded", colorScheme: "purple" },
            React.createElement(TabList, { overflowX: "auto", flexWrap: "wrap", gap: 1 },
              categories.map ? categories.map(function(cat) {
                var c2 = catGroup[cat[0]] || [];
                var ul2 = 0;
                for (var i = 0; i < c2.length; i++) { if (st.ach && st.ach[c2[i][0]] && st.ach[c2[i][0]].u) ul2++; }
                return React.createElement(Tab, { key: cat[0], fontSize: "sm", whiteSpace: "nowrap" },
                  cat[2] + " " + cat[1] + " (" + ul2 + "/" + c2.length + ")"
                );
              }) : null
            ),
            React.createElement(TabPanels, null,
              categories.map ? categories.map(function(cat) {
                var catAch = catGroup[cat[0]] || [];
                return React.createElement(TabPanel, { key: cat[0] },
                  React.createElement(SimpleGrid, { columns: { base: 1, md: 2, lg: 3 }, spacing: 3, mt: 3 },
                    catAch.map ? catAch.map(function(ad) { return achCard(ad); }) : null
                  )
                );
              }) : null
            )
          ),
          React.createElement(Box, {
            p: 3, borderRadius: "lg",
            bg: "gray.750", border: "1px solid", borderColor: "gray.650",
            cursor: "pointer",
            sx: { transition: "all 0.2s", _hover: { bg: "gray.700", borderColor: "gray.500" } },
            onClick: function(e) {
              e.stopPropagation(); host.actions.openExternalLink("https://github.com/YoshinoHdq/SJMCL-Trophy-Craft");
            }
          },
            React.createElement(HStack, { spacing: 3, align: "center" },
                        React.createElement(Box, {
            p: 3, borderRadius: "lg",
            bg: "gray.750", border: "1px solid", borderColor: "gray.650",
            cursor: "pointer",
            sx: { transition: "all 0.2s", _hover: { bg: "gray.700", borderColor: "gray.500" } },
            onClick: function(e) { e.stopPropagation(); setShowReport(true); }
          },
            React.createElement(HStack, { spacing: 3, align: "center" },
              React.createElement(Box, {
                w: 8, h: 8, borderRadius: "md",
                bgGradient: "linear(to-br, purple.500, blue.500)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "md"
              }, "\u{1F50D}"),
              React.createElement(VStack, { spacing: 0, align: "start" },
                React.createElement(Text, { fontSize: "xs", color: "gray.400", lineHeight: 1.3 }, "\u5206\u6790\u4F60\u7684\u542F\u52A8\u5668\u4E60\u60EF"),
                React.createElement(Text, { fontSize: "sm", color: "purple.300", fontWeight: "semibold", lineHeight: 1.3 },
                  "\u542F\u52A8\u5668\u4EBA\u683C\u62A5\u544A"
                )
              ),
              React.createElement(Spacer),
              React.createElement(Text, { fontSize: "md", color: "gray.500" }, "\u2192")
            )
          ),
React.createElement(Box, {
                w: 8, h: 8, borderRadius: "md",
                bg: "#1B1F23", display: "flex", alignItems: "center", justifyContent: "center"
              },
                React.createElement("svg", { viewBox: "0 0 16 16", width: "16", height: "16", fill: "white" },
                  React.createElement("path", { d: "M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" })
                )
              ),
              React.createElement(VStack, { spacing: 0, align: "start" },
                React.createElement(Text, { fontSize: "xs", color: "gray.400", lineHeight: 1.3 }, "\u5F00\u6E90\u5728 GitHub"),
                React.createElement(Text, { fontSize: "sm", color: "#58A6FF", fontWeight: "semibold", lineHeight: 1.3 },
                  "YoshinoHdq/SJMCL-Trophy-Craft"
                )
              ),
              React.createElement(Spacer),
              React.createElement(Text, { fontSize: "md", color: "gray.500" }, "\u2192")
            ),
            React.createElement(Text, { fontSize: "xs", color: "gray.500", mt: 2, pl: 0.5 },
              "\u60F3\u5230\u65B0\u6210\u5C31\u7684\u70B9\u5B50\u4E86\uFF1F\u6B22\u8FCE\u6765 GitHub \u63D0 Issue"
            )
          )
        )
      );
    };

    return {
      homeWidget: { title: "\u542F\u52A8\u5668\u6210\u5C31", defaultWidth: 360, minWidth: 280, Component: HomeWidgetComponent },
      page: { routePath: "achievements", isStandAlone: true, Component: AchievementWallPage },
      settingsPage: { Component: AchievementWallPage }
    };
  }

  window.registerExtension(extensionFactory, token);
})();
