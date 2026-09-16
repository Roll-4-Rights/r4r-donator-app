<template>
  <v-container class="py-10 px-6" max-width="1200">

    <!-- PAGE HEADER — lives outside the card/form, always visible -->
    <div class="page-header mb-6">
      <h1 class="page-title">Submit Contributor Information</h1>
      <p class="page-sub">Tell us about yourself and your shipping preferences so bidders know what to expect.</p>
    </div>

    <div class="mx-auto" style="max-width: 900px;">
      <!-- LOADING STATE (checking for existing profile on page load) -->
      <v-card v-if="isCheckingProfile" class="rounded-2xl border-0 mb-12 pa-8 text-center" elevation="0">
        <v-progress-circular indeterminate color="#0B4F6C"></v-progress-circular>
      </v-card>

      <!-- SUBMITTED / CONFIRMATION STATE — fully replaces the form -->
      <v-card
        v-else-if="!showForm"
        class="rounded-2xl border-0 mb-12 pa-8"
        elevation="0"
        style="background-color: #FFFFFF !important; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.03) !important;"
      >
        <v-icon icon="mdi-check-circle" color="green-darken-1" size="40" class="mb-3"></v-icon>
        <h2 class="text-h5 font-weight-black text-black mb-2">Form submitted</h2>
        <p class="text-body-2 text-medium-emphasis mb-6">
          Your information has been saved. If you need to correct anything (a typo, add/remove countries, etc.),
          you can resubmit at any time to overwrite your previous answers. We'd appreciate alerting a team member of the changes, thanks!
        </p>
        <v-btn
          color="#0B4F6C"
          variant="outlined"
          class="text-none font-weight-bold rounded-lg px-6"
          @click="showForm = true"
        >
          Resubmit form
        </v-btn>
      </v-card>

      <!-- FORM STATE -->
      <v-card
        v-else
        class="rounded-2xl border-0 mb-12"
        style="background-color: #FFFFFF !important; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.03) !important;"
        elevation="0"
      >
        <v-card-text class="pa-6 pa-md-10">

          <v-alert
            type="warning"
            variant="tonal"
            density="comfortable"
            rounded="lg"
            class="mb-8 text-body-2 font-weight-medium"
            icon="mdi-alert-circle-outline"
          >
            Please submit this form only once! You will be able to make edits to your contributor profile afterward if needed.
          </v-alert>

          <v-alert v-if="submitError" type="error" variant="tonal" class="mb-6" closable @click:close="submitError = ''">
            {{ submitError }}
          </v-alert>

          <v-form @submit.prevent="handleSubmitDonatorInfo">

            <!-- SECTION: Basic Information -->
            <div class="section-heading">
              <v-icon icon="mdi-account-outline" size="20"></v-icon>
              <span>Basic Information</span>
            </div>

            <div class="field-block">
              <label class="field-label">Social media name<span class="req">*</span></label>
              <v-text-field
                v-model="form.socialName"
                placeholder="e.g. @yourinstagramhandle"
                variant="outlined"
                density="compact"
                color="#0B4F6C"
                rounded="lg"
                persistent-placeholder
                required
              ></v-text-field>
            </div>

            <div class="field-block">
              <label class="field-label">Description of yourself and your wares<span class="req">*</span></label>
              <v-textarea
                v-model="form.waresDescription"
                placeholder="e.g. I create artisan polyhedral dice and other tabletop gaming accessories."
                variant="outlined"
                density="compact"
                color="#0B4F6C"
                rounded="lg"
                rows="3"
                auto-grow
                persistent-placeholder
                required
              ></v-textarea>
            </div>

            <div class="field-block">
              <label class="field-label">The country you are shipping from?<span class="req">*</span></label>
              <small class="field-note">This will be used to display your country shipping location on your auction item(s).</small>
              <v-text-field
                v-model="form.location"
                placeholder="e.g. Canada"
                variant="outlined"
                density="compact"
                color="#0B4F6C"
                rounded="lg"
                persistent-placeholder
                required
              ></v-text-field>
            </div>

            <div class="field-block field-block-last">
              <label class="field-label">Website URL<span class="req">*</span></label>
              <small class="field-note">or social media link if you don't have a website/store</small>
              <v-text-field
                v-model="form.website"
                placeholder="e.g. https://yourshop.com"
                variant="outlined"
                density="compact"
                color="#0B4F6C"
                rounded="lg"
                persistent-placeholder
                required
              ></v-text-field>
            </div>

            <v-divider class="section-divider"></v-divider>

            <!-- SECTION: Shipping Details -->
            <div class="section-heading">
              <v-icon icon="mdi-truck-outline" size="20"></v-icon>
              <span>Shipping Details</span>
            </div>

            <div class="field-block">
              <label class="field-label">Shipping<span class="req">*</span></label>
              <v-radio-group v-model="form.shippingType" color="#0B4F6C" hide-details class="mt-1">
                <v-radio label="I will pay for shipping" value="Donator pays shipping" class="mb-2"></v-radio>
                <v-radio label="The item winner will pay for shipping" value="Winner pays shipping"></v-radio>
              </v-radio-group>
            </div>

            <div class="field-block">
              <label class="field-label">Estimated shipping cost</label>
              <v-textarea
                v-model="form.shippingCost"
                placeholder="e.g. United States: $7, Australia: $30, etc."
                variant="outlined"
                density="compact"
                color="#0B4F6C"
                rounded="lg"
                rows="2"
                auto-grow
                persistent-placeholder
              ></v-textarea>
            </div>

            <div class="field-block field-block-last">
              <label class="field-label">If applicable, how would you like your item winner to pay for shipping?</label>
              <v-text-field
                v-model="form.winnerPaymentMethod"
                placeholder="e.g. PayPal, Venmo, Ko-fi"
                variant="outlined"
                density="compact"
                color="#0B4F6C"
                rounded="lg"
                persistent-placeholder
              ></v-text-field>
            </div>

            <v-divider class="section-divider"></v-divider>

            <!-- SECTION: Country Shipping Locations -->
            <div class="section-heading">
              <v-icon icon="mdi-earth" size="20"></v-icon>
              <span>Country Shipping Locations</span>
            </div>

            <v-alert
              type="info"
              variant="tonal"
              density="comfortable"
              rounded="lg"
              icon="mdi-information-outline"
              class="mb-4 country-info-alert"
            >
              <strong>Please read carefully:</strong> Check the boxes of the countries <strong>you are able to ship to.</strong>
              <br>
              Clicking the 'Worldwide' box will check every box. You may then uncheck the boxes of the countries you do not ship to, if that is easier.
              <br>
              <br>
              <em>If you are using the quick remove buttons, please still check over your selection for any errors.</em>
            </v-alert>

            <div class="d-flex align-center mb-2 flex-wrap preset-btn-row">
              <span class="preset-label"></span>
              <v-btn
                @click="selectAll()"
                color="#0B4F6C"
                variant="elevated"
                density="default"
                size="small"
                class="text-none font-weight-bold rounded-lg px-3 py-1"
              >
                Worldwide
              </v-btn>
              <v-btn @click="clearAll()" color="white" variant="elevated" density="default" size="small" class="text-none font-weight-bold rounded-lg px-3 py-1 text-black">
                Clear All
              </v-btn>
            </div>

            <div class="d-flex align-center mb-4 flex-wrap preset-btn-row">
              <span class="preset-label">Quick remove:</span>
              <v-btn @click="excludeGroup(euNations)" color="white" variant="elevated" density="default" size="small" class="text-none font-weight-bold rounded-lg px-3 py-1 text-black">
                Remove EU Countries
              </v-btn>
              <v-btn @click="excludeGroup(usaRestricted)" color="white" variant="elevated" density="default" size="small" class="text-none font-weight-bold rounded-lg px-3 py-1 text-black">
                Remove USPS-Restricted Countries
              </v-btn>
              <v-btn @click="excludeGroup(sanctionedCountries)" color="white" variant="elevated" density="default" size="small" class="text-none font-weight-bold rounded-lg px-3 py-1 text-black">
                Remove Sanctioned Countries
              </v-btn>
            <!---  <v-btn @click="excludeGroup(warAffectedRegions)" color="white" variant="elevated" density="default" size="small" class="text-none font-weight-bold rounded-lg px-3 py-1 text-black">
                Remove War-Affected Regions
              </v-btn>  --->
              <v-btn @click="excludeGroup(remoteTerritories)" color="white" variant="elevated" density="default" size="small" class="text-none font-weight-bold rounded-lg px-3 py-1 text-black">
                Remove Remote Territories
              </v-btn>
            </div>

            <div class="country-box mb-2">
              <div class="country-search-wrap">
                <v-text-field
                  v-model="countrySearch"
                  placeholder="Search countries..."
                  variant="solo"
                  flat
                  density="compact"
                  color="#0B4F6C"
                  prepend-inner-icon="mdi-magnify"
                  clearable
                  hide-details
                  class="country-search-input"
                ></v-text-field>
              </div>
              <v-divider></v-divider>
              <div class="country-list-scroll pa-4">
                <template v-for="group in groupedCountries" :key="group.letter">
                  <div class="country-group-label">{{ group.letter }}</div>
                  <v-row no-gutters>
                    <v-col
                      cols="12"
                      sm="6"
                      md="4"
                      v-for="country in group.items"
                      :key="country"
                      class="country-checkbox-col"
                    >
                      <v-checkbox
                        v-model="form.shippingCountries"
                        :label="country"
                        :value="country"
                        color="#0B4F6C"
                        hide-details
                        density="compact"
                      ></v-checkbox>
                    </v-col>
                  </v-row>
                </template>

                <p v-if="countrySearch && filteredCountries.length === 0" class="text-caption text-medium-emphasis text-center py-4">
                  No countries match "{{ countrySearch }}"
                </p>
              </div>
            </div>

            <div class="country-counter-wrap mb-8">
              {{ form.shippingCountries.length }} of {{ countries.length }} selected
            </div>

            <div class="d-flex justify-end">
              <v-btn
                type="submit"
                color="#0B4F6C"
                variant="flat"
                size="large"
                class="text-none font-weight-bold rounded-lg px-12 py-2 text-white"
                :loading="isSubmitting"
              >
                Submit Info
              </v-btn>
            </div>

          </v-form>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { apiService } from '@/services/api'

const countrySearch = ref('')
const isSubmitting = ref(false)
const isCheckingProfile = ref(true)
const showForm = ref(true) // true = show the editable form, false = show the "submitted" confirmation screen
const submitError = ref('')

const form = ref({
  socialName: '',
  waresDescription: '',
  location: '',
  website: '',
  shippingType: 'Donator pays shipping',
  shippingCost: '',
  winnerPaymentMethod: '',
  shippingCountries: [] as string[]
})

// NocoDB MultiSelect values come back as a comma-separated string — split into an array for the form.
const parseCountriesField = (value: unknown): string[] => {
  if (Array.isArray(value)) return value
  if (typeof value === 'string' && value.length) return value.split(',').map(v => v.trim())
  return []
}

const handleSubmitDonatorInfo = async () => {
  submitError.value = ''
  isSubmitting.value = true
  try {
    await apiService.saveDonatorProfile({
      "Social Media Name": form.value.socialName,
      "Wares Description": form.value.waresDescription,
      "Location": form.value.location,
      "Website": form.value.website,
      "Shipping Type": form.value.shippingType,
      "Estimated Shipping Cost": form.value.shippingCost,
      "Winner Payment Method": form.value.winnerPaymentMethod,
      "Shipping Countries": form.value.shippingCountries.join(','),
      "Submitted At": new Date().toISOString()
    })
    showForm.value = false // swap to the confirmation screen, fully replacing the form
  } catch (err: any) {
    console.error('Donator profile submission failed:', err)
    submitError.value = err.message || 'Submission failed. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

// Order doesn't matter in this raw list — add new entries anywhere and
// they'll auto-sort into the right alphabetical spot below.
const countries = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France',
  'Afghanistan', 'Åland Islands', 'Albania', 'Algeria', 'American Samoa', 'Andorra',
  'Angola', 'Anguilla', 'Antarctica', 'Antigua & Barbuda', 'Argentina', 'Armenia',
  'Aruba', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados',
  'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia',
  'Bonaire & Sint Eustatius & Saba', 'Bosnia & Herzegovina', 'Botswana', 'Bouvet Island',
  'Brazil', 'British Indian Ocean Territory', 'British Virgin Islands', 'Brunei',
  'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Cape Verde',
  'Cayman Islands', 'Central African Republic', 'Chad', 'Chile', 'China',
  'Christmas Island', 'Cocos (Keeling) Islands', 'Colombia', 'Comoros',
  'Congo (Democratic Republic of the)', 'Congo (Republic of the)', 'Cook Islands',
  'Costa Rica', "Côte d'Ivoire", 'Croatia', 'Cuba', 'Curaçao', 'Cyprus',
  'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic',
  'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia',
  'Eswatini', 'Ethiopia', 'Falkland Islands', 'Faroe Islands', 'Fiji', 'Finland',
  'French Guiana', 'French Polynesia', 'French Southern Territories', 'Gabon',
  'Gambia', 'Georgia', 'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada',
  'Guadeloupe', 'Guam', 'Guatemala', 'Guernsey', 'Guinea', 'Guinea-Bissau',
  'Guyana', 'Haiti', 'Heard Island & McDonald Islands', 'Honduras', 'Hong Kong',
  'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland',
  'Isle of Man', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jersey', 'Jordan',
  'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia',
  'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania',
  'Luxembourg', 'Macau', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali',
  'Malta', 'Marshall Islands', 'Martinique', 'Mauritania', 'Mauritius', 'Mayotte',
  'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro',
  'Montserrat', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal',
  'Netherlands', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria',
  'Niue', 'Norfolk Island', 'North Korea', 'North Macedonia',
  'Northern Mariana Islands', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine',
  'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Pitcairn Islands',
  'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Réunion', 'Romania', 'Russia',
  'Rwanda', 'Saint Barthélemy', 'Saint Helena, Ascension & Tristan da Cunha',
  'Saint Kitts & Nevis', 'Saint Lucia', 'Saint Martin (French part)',
  'Saint Pierre & Miquelon', 'Saint Vincent & the Grenadines', 'Samoa', 'San Marino',
  'Sao Tome & Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles',
  'Sierra Leone', 'Singapore', 'Sint Maarten (Dutch part)', 'Slovakia', 'Slovenia',
  'Solomon Islands', 'Somalia', 'South Africa', 'South Georgia & the South Sandwich Islands',
  'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname',
  'Svalbard & Jan Mayen', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan',
  'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tokelau', 'Tonga',
  'Trinidad & Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks & Caicos Islands',
  'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates',
  'United States Minor Outlying Islands', 'United States Virgin Islands', 'Uruguay',
  'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Wallis & Futuna',
  'Western Sahara', 'Yemen', 'Zambia', 'Zimbabwe'
]

const usaRestricted = ['Afghanistan', 'Eritrea', 'Iran', 'Kuwait', 'Lebanon', 'Seychelles', 'Venezuela', 'Kiribati']


const sanctionedCountries = ['Cuba', 'Iran', 'North Korea', 'Syria', 'Russia', 'Belarus']


// const warAffectedRegions = [
//   'Ukraine', 'Russia', 'Belarus', 'Yemen', 'Somalia', 'Sudan', 'South Sudan', 'Myanmar'
// ]


const remoteTerritories = [
  'Antarctica', 'Bouvet Island', 'Christmas Island', 'Pitcairn Islands',
  'Heard Island & McDonald Islands', 'French Southern Territories',
  'South Georgia & the South Sandwich Islands', 'Svalbard & Jan Mayen',
  'Tokelau', 'Niue'
]

const euNations = [
  'Germany', 'France', 'Netherlands', 'Belgium', 'Luxembourg', 'Austria',
  'Italy', 'Spain', 'Portugal', 'Greece', 'Malta', 'Cyprus',
  'Poland', 'Czech Republic', 'Slovakia', 'Hungary', 'Slovenia', 'Croatia', 'Romania', 'Bulgaria',
  'Sweden', 'Denmark', 'Finland',
  'Ireland', 'Estonia', 'Latvia', 'Lithuania'
]

const countriesList = computed(() => [...countries].sort((a, b) => a.localeCompare(b)))

const filteredCountries = computed(() => {
  const query = countrySearch.value.trim().toLowerCase()
  if (!query) return countriesList.value
  return countriesList.value.filter(country => country.toLowerCase().includes(query))
})

// Groups the (already filtered/searched) countries by first letter so the
// checklist can render with A-Z section headers instead of one flat wall of items.
const groupedCountries = computed(() => {
  const groups: Record<string, string[]> = {}
  filteredCountries.value.forEach(country => {
    const letter = country[0].toUpperCase()
    if (!groups[letter]) groups[letter] = []
    groups[letter].push(country)
  })
  return Object.keys(groups).sort().map(letter => ({ letter, items: groups[letter] }))
})

function selectAll(): void {
  form.value.shippingCountries = [...countries]
}
function excludeGroup(namesToRemove: string[]): void {
  const current = new Set(form.value.shippingCountries)
  namesToRemove.forEach(name => current.delete(name))
  form.value.shippingCountries = Array.from(current)
}
function clearAll(): void {
  form.value.shippingCountries = []
}

onMounted(async () => {
  try {
    const profile = await apiService.fetchDonatorProfile()
    if (profile) {
      form.value.socialName = profile['Social Media Name'] || ''
      form.value.waresDescription = profile['Wares Description'] || ''
      form.value.location = profile['Location'] || ''
      form.value.website = profile['Website'] || ''
      form.value.shippingType = profile['Shipping Type'] || 'Donator pays shipping'
      form.value.shippingCost = profile['Estimated Shipping Cost'] || ''
      form.value.winnerPaymentMethod = profile['Winner Payment Method'] || ''
      form.value.shippingCountries = parseCountriesField(profile['Shipping Countries'])
      showForm.value = false // they've already submitted before — show the confirmation screen, not the form
    }
  } catch (err) {
    console.error('Failed to load existing donator profile:', err)
  } finally {
    isCheckingProfile.value = false
  }
})
</script>

<style scoped>
:deep(.v-field__outline) {
  --v-field-border-opacity: 0.15;
}



.border-light-outline {
  border: 1px solid rgba(0, 0, 0, 0.12) !important;
}

/* Page header — sits outside the card entirely */
.page-header {
  padding-left: 4px;
}
.page-eyebrow {
  display: block;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.72);
  margin-bottom: 0.5rem;
}
.page-title {
  font-size: 2.25rem;
  font-weight: 900;
  color: #000000;
  letter-spacing: -0.02em;
  margin: 0 0 0.5rem;
}
.page-sub {
  font-size: 0.95rem;
  color: rgba(0, 0, 0, 0.72);
  max-width: 46ch;
  margin: 0;
}

/* Section group headings inside the form */
.section-heading {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.15rem;
  font-weight: 800;
  color: #0B4F6C;
  margin-bottom: 20px;
}

.section-divider {
  margin: 32px 0;
  opacity: 0.5;
}

.section-note {
  font-size: 0.95rem;
  color: rgba(0, 0, 0, 0.65);
  line-height: 1.6;
  margin-bottom: 16px;
}

/* Field label + spacing wrapper */
.field-block {
  margin-bottom: 24px;
}
.field-block-last {
  margin-bottom: 0;
}

.field-label {
  display: block;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 8px;
}
.field-label .req {
  color: #C0392B;
  margin-left: 2px;
}

.field-note {
  display: block;
  font-size: 0.85rem;
  color: rgba(0, 0, 0, 0.55);
  margin-bottom: 6px;
}

.preset-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.55);
}

.preset-btn-row {
  gap: 10px !important;
}
.preset-btn-row > .v-btn {
  margin: 0 !important;
}

.country-counter {
  font-size: 0.85rem;
  font-weight: 700;
  color: #0B4F6C;
  white-space: nowrap;
}

.country-box {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 16px;
  background-color: #FFFFFF;
  overflow: hidden;
}

.country-search-wrap {
  padding: 6px 10px;
}

.country-search-input :deep(.v-field) {
  background-color: transparent;
  box-shadow: none;
}

.country-list-scroll {
  max-height: 320px;
  overflow-y: auto;
}

.country-counter-wrap {
  text-align: right;
  font-size: 0.85rem;
  font-weight: 700;
  color: #0B4F6C;
}

.country-group-label {
  position: sticky;
  top: -16px;
  z-index: 1;
  background: #FFFFFF;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  color: rgba(0, 0, 0, 0.4);
  padding: 6px 4px 4px;
  margin-top: 4px;
}

.country-checkbox-col {
  border-radius: 6px;
  transition: background-color 0.12s ease;
}
.country-checkbox-col:hover {
  background-color: rgba(11, 79, 108, 0.06);
}
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.02);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.25);
}
</style>