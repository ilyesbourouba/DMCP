const StatsModel = require('../model/stats');
const ContactsModel = require('../model/contacts');

exports.dashboardPage = async (req, res, next) => {
    let status = [];
    let blacklist = [];
    let totalRevenueByProduct = [];
    let sellsByMonths = [];
    let bestClientSellsByMoney = [];
    let bestClientSellsByQuantity = [];
    let chiffreAffaire = 0;
    let bestCategorySellsByitem = [];

    const blacklistData = await StatsModel.getBlacklist();
    const sellsStatus = await StatsModel.getSellsStatus();
    const totalRevenue = await StatsModel.totalRevenueByProduct();
    const sellsByMonthsData = await StatsModel.sellsByMouths();
    const bestClientSellsByMoneyData = await StatsModel.bestClientSellsByMoney();
    const bestClientSellsByQuantityData = await StatsModel.bestClientSellsByQuantity();
    const chiffreAffaireData = await StatsModel.chiffreAffaire();
    const bestCategorySellsByitemData = await StatsModel.bestCategorySells();

    if (chiffreAffaireData.success) chiffreAffaire = chiffreAffaireData.data[0];
    if (bestClientSellsByMoneyData.success) bestClientSellsByMoney = bestClientSellsByMoneyData.data;
    if (sellsStatus.success) status = sellsStatus.data;
    if (blacklistData.success) blacklist = blacklistData.data;
    if (totalRevenue.success) totalRevenueByProduct = totalRevenue.data;
    if (sellsByMonthsData.success) sellsByMonths = sellsByMonthsData.data;
    if (bestClientSellsByQuantityData.success) bestClientSellsByQuantity = bestClientSellsByQuantityData.data;
    if (bestCategorySellsByitemData.success) bestCategorySellsByitem = bestCategorySellsByitemData.data[0];
    console.log(bestCategorySellsByitem);

    res.render('dashboard', {
        user: req.user,
        sectionName: 'Dashboard',
        pageName: 'Dashboard',
        status,
        blacklist,
        totalRevenueByProduct,
        sellsByMonths,
        bestClientSellsByMoney,
        bestClientSellsByQuantity,
        chiffreAffaire,
        bestCategorySellsByitem
    });
}

exports.contactsPage = async (req, res, next) => {

    let contacts = [];
    const contactsData = await ContactsModel.getContacts();
    if (contactsData.success) contacts = contactsData.data[0];
    console.log(contacts);

    res.render('contacts', {
        user: req.user,
        sectionName: 'Contacts',
        pageName: 'Contacts',
        contacts
    });
}
exports.updateContacts = async (req, res, next) => {
    const { phone, adr, mail, facebook, instagram, google_play, ios } = req.body;

    console.log(phone, adr, mail, facebook, instagram, google_play, ios);

    const updateContacts = await ContactsModel.updateContacts(phone, adr, mail, facebook, instagram, google_play, ios);

    if (updateContacts.success) {
        return res.json({ success: true, message: 'Contacts updated successfully' });
    } else {
        return res.json({ success: false, message: 'Error updating contacts' });
    }
}