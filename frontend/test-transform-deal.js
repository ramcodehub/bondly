import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Simulate the transformDeal function from useDealsRealtime.ts
function transformDeal(dealData) {
  return {
    id: dealData.id,
    name: dealData.name,
    amount: dealData.amount || 0,
    company: dealData.leads?.company || dealData.companies?.name || 'Unknown Company',
    contact: dealData.contacts?.name || 
             (dealData.leads ? `${dealData.leads.first_name || ''} ${dealData.leads.last_name || ''}`.trim() : '') || 
             'Unknown Contact',
    stage: dealData.stage,
    probability: dealData.probability || 0,
    closeDate: dealData.close_date || '',
    close_date: dealData.close_date || '',
    description: dealData.description || '',
    companyIndustry: dealData.companies?.industry || '',
    contactEmail: dealData.contacts?.email || dealData.leads?.email || '',
    contactPhone: dealData.contacts?.phone || dealData.leads?.phone || '',
    lead_id: dealData.lead_id,
    contact_id: dealData.contact_id,
    account_id: dealData.company_id,
    owner_id: dealData.owner_id,
    deal_source: dealData.deal_source,
    competitors: dealData.competitors,
    next_step: dealData.next_step,
    created_at: dealData.created_at,
    updated_at: dealData.updated_at,
    created_by: dealData.created_by
  }
}

async function testTransformDeal() {
  console.log('Testing deal transformation...\n')
  
  // Fetch a deal with all relationships
  console.log('1. Fetching deal with relationships...')
  try {
    const { data, error } = await supabase
      .from('deals')
      .select(`
        *,
        leads(first_name, last_name, email, phone, company),
        contacts(name, email, phone),
        companies(name, industry)
      `)
      .limit(1)
    
    if (error) {
      console.error('❌ Error fetching deal:', error)
      return
    }
    
    if (!data || data.length === 0) {
      console.log('   No deals found')
      return
    }
    
    const dealData = data[0]
    console.log('✅ Fetched deal data:')
    console.log('   ID:', dealData.id)
    console.log('   Name:', dealData.name)
    console.log('   Company ID:', dealData.company_id)
    console.log('   Companies data:', dealData.companies)
    console.log('   Leads data:', dealData.leads)
    console.log('   Contacts data:', dealData.contacts)
    
    // Transform the deal
    console.log('\n2. Transforming deal...')
    const transformedDeal = transformDeal(dealData)
    console.log('✅ Transformed deal:')
    console.log('   ID:', transformedDeal.id)
    console.log('   Name:', transformedDeal.name)
    console.log('   Company:', transformedDeal.company)
    console.log('   Contact:', transformedDeal.contact)
    console.log('   Stage:', transformedDeal.stage)
    console.log('   Amount:', transformedDeal.amount)
    
    // Test with a deal that has company_id set
    console.log('\n3. Testing with deal that has company_id...')
    // Get a company
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('id, name, industry')
      .limit(1)
    
    if (companiesError) {
      console.error('❌ Error fetching companies:', companiesError)
      return
    }
    
    if (companies && companies.length > 0) {
      const company = companies[0]
      console.log('   Using company:', company.name)
      
      // Update a deal with company_id
      const { data: updatedDeal, error: updateError } = await supabase
        .from('deals')
        .update({ company_id: company.id })
        .eq('id', dealData.id)
        .select(`
          *,
          leads(first_name, last_name, email, phone, company),
          contacts(name, email, phone),
          companies(name, industry)
        `)
      
      if (updateError) {
        console.error('❌ Error updating deal:', updateError)
        return
      }
      
      console.log('✅ Updated deal with company_id')
      const updatedDealData = updatedDeal[0]
      console.log('   Companies data:', updatedDealData.companies)
      
      // Transform the updated deal
      const transformedUpdatedDeal = transformDeal(updatedDealData)
      console.log('✅ Transformed updated deal:')
      console.log('   Company:', transformedUpdatedDeal.company)
      console.log('   Company Industry:', transformedUpdatedDeal.companyIndustry)
      
      // Clean up
      await supabase
        .from('deals')
        .update({ company_id: null })
        .eq('id', dealData.id)
      
      console.log('✅ Cleaned up company_id')
    }
    
  } catch (error) {
    console.error('❌ Error in transform test:', error)
  }
}

async function main() {
  console.log('Starting deal transformation test...\n')
  await testTransformDeal()
  console.log('\nTest completed.')
}

main()