
const app = getApp()
Page({
  data: {
    content: `
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">请您在使用本产品之前，请务必仔细阅读并理解<span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;; color: rgb(0, 112, 192);">《<span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;; font-size: 16px;"><strong style="text-align: center; white-space: normal;">光馥科美用户许可使用协议</strong></span>》</span>（以下简称“本协议”）中规定的权利和限制。</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">我们⼀向尊重并会严格保护⽤户在使⽤本产品时的合法权益（包括⽤户隐私、⽤户数据等）不受到任何侵犯。</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">本协议（包括本⽂最后部分的隐私政策）是⽤户（包括通过各种合法途径获取到本产品的⾃然⼈、法⼈或其他组织机构，以下简称“⽤户”或“您”）与我们之间针对本产品相关事项最终的、完整的且排他的协议，并取代、合并之前的当事⼈之间关于上述事项的讨论和协议。</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">本协议将对⽤户使⽤本产品的⾏为产⽣法律约束⼒，您已承诺和保证有权利和能⼒订⽴本协议。⽤户开始使⽤本产品将视为已经接受本协议，请认真阅读并理解本协议中各种条款，包括免除和限制我们的免责条款和对⽤户的权利限制（未成年⼈审阅时应由法定监护⼈陪同），如果您不能接受本协议中的全部条款，请勿开始使⽤本产品。</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;"><strong>使⽤账户您必须承诺和保证：</strong></span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">1. 您使⽤本产品的⾏为必须合法</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">本产品将会依据本协议“修改和终⽌”的规定保留或终⽌您的账户。您必须承诺对您的登录信息保密、不被其他⼈获取与使⽤，并且对您在本账户下的所有⾏为负责。您必须将任何有可能触犯法律的、未授权使⽤或怀疑为未授权使⽤的⾏为在第⼀时间通知本产品。本产品不对您因未能遵守上述要求⽽造成的损失承担法律责任。</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;"><strong>终端⽤户协议许可</strong></span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">依据本协议规定，本产品将授予您以下不可转让的、⾮排他的许可：</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">1.使⽤本产品的权利；</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">2.在您所有的⽹络通信设备、计算机设备和移动通信设备上下载、安装、使⽤本产品的权利。</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;"><strong>限制性条款</strong></span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">本协议对您的授权将受到以下限制：</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">1. 您不得对本产品进⾏任何形式的许可、出售、租赁、转让、发⾏或其他商业⽤途；</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">2. 除⾮法律禁⽌此类限制，否则您不得对本产品的任何部分或衍⽣产品进⾏修改、翻译、改编、合并、利⽤、分解、改造或反向编译、反向⼯程等；</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">3.您不得以创建相同或竞争服务为⽬的使⽤本产品；</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">4. 除⾮法律明⽂规定，否则您不得对本产品的任何部分以任何形式或⽅法进⾏⽣产、复制、发⾏、出售、下载或显⽰等；</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">5. 您不得删除或破坏包含在本产品中的任何版权声明或其他所有权标记。</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;"><strong>费⽤</strong></span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">您必须⾃⾏负担购买本产品的费⽤，个⼈上⽹或第三⽅（包括但不限于电信或移动通讯提供商）收取的通讯费、信息费等相关费⽤。如涉及电信增值服务，我们建议您与增值服务提供商确认相关费⽤问题。</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;"><strong>版本</strong></span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">任何本产品的更新版本或未来版本、更新或者其他变更将受到本协议约束。</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;"><strong>遵守法律</strong></span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">您同意在APP使用过程中遵守中华⼈民共和国法律法规的任何及所有的规定，并对以任何⽅式使⽤您的密码和您的账号使⽤本服务的任何⾏为及其结果承担全部责任。在任何情况下，如果本APP有理由认为您的任何⾏为，包括但不限于您的任何⾔论和其它⾏为违反或可能违反上述法律和法规的任何规定，本APP可在任何时候不经任何事先通知终⽌向您提供服务。</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;"><strong>⽤户内容</strong></span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">1.⽤户内容是指该⽤户下载、发布或以其他⽅式使⽤本产品时产⽣的所有内容（例如：您的信息、图⽚、⾳乐或其他内容）。</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">2.您是您的⽤户内容唯⼀的责任⼈，您将承担因您的⽤户内容披露⽽导致的您或任何第三⽅被识别的风险。</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">3.您已同意您的⽤户内容受到权利限制（详见“权利限制”）</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;"><strong>权利限制</strong></span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">您已同意通过分享或其他⽅式使⽤本产品中的相关服务，在使⽤过程中，您将承担因下述⾏为所造成的风险⽽产⽣的全部法律责任：</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">1.破坏宪法所确定的基本原则的；</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">2.危害国家安全、泄露国家秘密、颠覆国家政权、破坏国家统⼀的；</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">3.损害国家荣誉和利益的；</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">4.煽动民族仇恨、民族歧视，破坏民族团结的；</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">5.破坏国家宗教政策，宣扬邪教和封建迷信的；</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">6.散布淫秽、⾊情、赌博、暴⼒、凶杀、恐怖或者教唆犯罪的；</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">7.侮辱或者诽谤他⼈，侵害他⼈合法权益的；</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">8.含有法律、⾏政法规禁⽌的其他内容的。</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;"><strong>您已经同意不在本产品从事下列⾏为：</strong></span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">1.发布或分享电脑病毒、蠕⾍、恶意代码、故意破坏或改变计算机系统或数据的软件；</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">2.未授权的情况下，收集其他⽤户的信息或数据，例如电⼦邮箱地址等；</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">3.⽤⾃动化的⽅式恶意使⽤本产品，给服务器造成过度的负担或以其他⽅式⼲扰或损害⽹站服务器和⽹络链接；</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">4.在未授权的情况下，尝试访问本产品的服务器数据或通信数据；</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">5.⼲扰、破坏本产品其他⽤户的使⽤。</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;"><strong>修改和终⽌</strong></span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;"><strong>修改</strong></span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">本协议容许变更。如果本协议有任何实质性变更，我们将通过APP内公告或其他方式来通知您。变更通知之后，继续使⽤本产品则为您已知晓此类变更并同意条款约束；</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">我们保留在任何时候⽆需通知⽽修改、保留或关闭本产品任何服务之权利；</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">您已同意我们⽆需因修改、保留或关闭本产品任何服务之权利；</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">您已同意我们⽆需因修改、保留或关闭本产品任何服务的⾏为对您或第三⽅承担责任。</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;"><strong>终⽌</strong></span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">本协议⾃您接受之⽇起⽣效，在您使⽤本产品的过程中持续有效，直⾄依据本协议终⽌；</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">尽管有上述规定，如果您使⽤本产品的时间早于您接受本协议的时间，您在此知晓并同意本协议于您接受本协议的时间，您在此知晓并同意本协议于您第⼀次使⽤本产品时⽣效，除⾮依据本协议提前终⽌；</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">我们可能会依据法律的规定，保留您使⽤本产品或者本账户的权利；⽆论是否通知，我们将在任何时间以任何原因终⽌本协议，包括出于善意的相信您违反了我们可接受使⽤政策或本协议的其他规定；</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">不受前款规定所限，如果⽤户侵犯第三⼈的版权且我们接到版权所有⼈或版权所有⼈的合法代理⼈的通知后，我们保留终⽌本协议的权利；</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">⼀旦本协议终⽌，您使⽤本产品的权利即告终⽌。您应当知晓您的产品终⽌意味着您的⽤户内容将从我们的活动数据库中删除。我们不因终⽌本协议对您承担任何责任，包括终⽌您的⽤户账户和删除您的⽤户内容。</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;"><strong>第三⽅</strong></span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">您已知晓或同意我们的部分服务是基于第三⽅的技术⽀持获得；</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">您已知晓本协议是您在与我们之间签订，⽽⾮您与上述第三⽅之间签订。我们是基于本产品所产⽣的内容、维护、⽀持服务、保证和由此产⽣的诉讼等事项的唯⼀责任⼈。您已同意遵守且授权给本产品限制您有条件地使⽤本产品的服务。</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;"><strong>第三⽅信息和服务</strong></span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">1.本产品包含了第三⽅的部分信息和服务。我们不控制且不对第三⽅的信息和服务负责；</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">2.我们仅为您使⽤⽅便的⽬的或为承诺和保证第三⽅的需要⽽提供此类信息和服务；</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">3.⽤户需对使⽤第三⽅信息和服务产⽣的风险承担法律责任；</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">4.当⽤户访问第三⽅信息和服务时，适⽤第三⽅的条款和政策。</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;"><strong>赔偿</strong></span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">您已同意⽆害地使⽤本产品，避免因下述⾏为或相关⾏为遭受来第三⽅的任何投诉、诉讼、损失、损害、责任、成本和费⽤（包括律师费）：</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">1.⽤户使⽤本产品的⾏为；</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">2.⽤户的⽤户内容；</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">3.⽤户违反本协议的⾏为。</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">我们保留专属抗辩权和请求赔偿的权利您已同意，除⾮获得我们书⾯同意，您不得在您与我们共同对第三⽅提起的诉讼中单⽅和解。我们将尽合理努⼒将此类诉讼、诉讼⾏为或进程通知您。</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">在任何情况下，本产品都不对您或任何第三⽅因本协议产⽣的任何间接性、后果性、惩罚性的、偶然的、特殊或惩罚性的损害赔偿承担责任。访问、使⽤本产品所产⽣的损坏计算机系统或移动通讯设备数据的风险将由您个⼈承担。</span>
</p>
<p style="text-indent: 20px;">
    <strong style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">适⽤法律</strong>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">本协议适⽤中华⼈民共和国法律；如果双⽅发⽣纠纷，应本着友好的原则协商解决；如协商不成，应向所在地的法院提起诉讼。</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;"><strong>独⽴性</strong></span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">本协议中的某些条款因故⽆法适⽤，则本协议的其他条款继续适⽤且⽆法适⽤的条款将会被修改，以便其能够依法适⽤。</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;"><strong>完整性</strong></span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">本协议（包括隐私政策）是您和本产品之间关于本产品相关事项的最终的、完整的、排他的协议，且取代和合并之前当事⼈关于此类事项（包括之前的最终⽤户许可、服务条款和隐私政策）的讨论和协议；</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">每部分的题⽬只为阅读之便⽽⽆任何法律或合同义务；</span>
</p>
<p style="text-indent: 20px;">
    <span style="font-family: 微软雅黑, &quot;Microsoft YaHei&quot;;">除⾮我们书⾯同意，您不得转让本协议所规定的权利义务。任何违反上述规定企图转让的⾏为均⽆效。</span>
</p>
				`,
    statusBarHeight: app.globalData.statusBarHeight,
  },
  backClick() {
    wx.navigateBack({
      delta: 1
    });
  }
})