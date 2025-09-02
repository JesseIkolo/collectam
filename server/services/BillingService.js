class BillingService {
    constructor() {
        this.prices = {
            basic: 0,
            premium: 49
        };
    }

    getPlans() {
        return [
            { id: 'basic', name: 'Basic', price: this.prices.basic, currency: 'USD', features: ['Core API'] },
            { id: 'premium', name: 'Premium', price: this.prices.premium, currency: 'USD', features: ['Auto-assign', 'Realtime', 'Analytics'] }
        ];
    }

    async estimateInvoice(organizationId, month = new Date()) {
        // Mock: flat rate per plan; could extend to metering
        return { organizationId: String(organizationId), month: month.toISOString(), total: this.prices.premium, currency: 'USD', items: [] };
    }
}

module.exports = new BillingService();


