<template>
  <v-container class="py-10 px-6" max-width="900">

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
      <h1 class="text-h5 font-weight-black text-black mb-2">Form submitted</h1>
      <p class="text-body-2 text-medium-emphasis mb-6">
        Your donator information has been saved. If you need to correct anything (a typo, wrong countries, etc.),
        you can resubmit at any time to overwrite your previous answers.
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

        <div class="text-left mb-8">
          <h1 class="text-h4 font-weight-black text-black mb-1">Submit donator information</h1>
          <p class="text-subtitle-2 font-weight-bold text-amber-darken-3">
            <v-icon icon="mdi-alert-circle-outline" size="16" class="mr-1"></v-icon>
            Please submit this form only ONCE
          </p>
        </div>

        <v-alert v-if="submitError" type="error" variant="tonal" class="mb-6" closable @click:close="submitError = ''">
          {{ submitError }}
        </v-alert>

        <v-form @submit.prevent="handleSubmitDonatorInfo">

          <div class="text-subtitle-2 font-weight-bold text-black mb-2 pl-1">Social media name*</div>
          <v-text-field
            v-model="form.socialName"
            placeholder="e.g. @yourhandle"
            variant="outlined"
            density="comfortable"
            class="mb-4"
            color="#0B4F6C"
            rounded="lg"
            persistent-placeholder
            required
          ></v-text-field>

          <div class="text-subtitle-2 font-weight-bold text-black mb-2 pl-1">Description of your wares*</div>
          <v-textarea
            v-model="form.waresDescription"
            placeholder="e.g. what you want in the description section of your item"
            variant="outlined"
            density="comfortable"
            class="mb-4"
            color="#0B4F6C"
            rounded="lg"
            rows="3"
            auto-grow
            persistent-placeholder
            required
          ></v-textarea>

          <div class="text-subtitle-2 font-weight-bold text-black mb-2 pl-1">Where are you located?*</div>
          <v-text-field
            v-model="form.location"
            placeholder="be as detailed as you can without giving your full address"
            variant="outlined"
            density="comfortable"
            class="mb-4"
            color="#0B4F6C"
            rounded="lg"
            persistent-placeholder
            required
          ></v-text-field>

          <div class="text-subtitle-2 font-weight-bold text-black mb-2 pl-1">Website URL*</div>
          <v-text-field
            v-model="form.website"
            placeholder="e.g. https://yourshop.com, instagram link"
            variant="outlined"
            density="comfortable"
            class="mb-6"
            color="#0B4F6C"
            rounded="lg"
            persistent-placeholder
            required
          ></v-text-field>

          <v-divider class="mb-6 opacity-50"></v-divider>

          <div class="text-subtitle-2 font-weight-bold text-black mb-2 pl-1">Shipping*</div>
          <v-radio-group v-model="form.shippingType" color="#0B4F6C" class="mb-4">
            <v-radio label="I will pay for shipping" value="donator_pays" class="mb-2"></v-radio>
            <v-radio label="The item winner will pay for shipping" value="winner_pays"></v-radio>
          </v-radio-group>

          <div class="text-subtitle-2 font-weight-bold text-black mb-2 pl-1">Estimated shipping cost</div>
          <v-text-field
            v-model="form.shippingCost"
            placeholder="e.g. United States: $7"
            variant="outlined"
            density="comfortable"
            class="mb-4"
            color="#0B4F6C"
            rounded="lg"
            persistent-placeholder
          ></v-text-field>

          <div class="text-subtitle-2 font-weight-bold text-black mb-2 pl-1">
            If applicable, how would you like your item winner to pay for shipping?
          </div>
          <v-text-field
            v-model="form.winnerPaymentMethod"
            placeholder="e.g. PayPal, Venmo, Ko-fi"
            variant="outlined"
            density="comfortable"
            class="mb-6"
            color="#0B4F6C"
            rounded="lg"
            persistent-placeholder
          ></v-text-field>

          <v-divider class="mb-6 opacity-50"></v-divider>

          <div class="text-left mb-4 pl-1">
            <div class="text-subtitle-2 font-weight-bold text-black"><strong>Please read carefully:</strong>
            Select what countries you *DO* you ship to, selecting <em>all that apply</em>*</div>
            <p class="text-caption text-medium-emphasis mt-1">If you ship worldwide, just select "Worldwide" at the top of the list.</p>
          </div>

          <v-text-field
            v-model="countrySearch"
            placeholder="Search countries..."
            variant="outlined"
            density="comfortable"
            class="mb-3"
            color="#0B4F6C"
            rounded="lg"
            prepend-inner-icon="mdi-magnify"
            clearable
            hide-details
          ></v-text-field>

          <v-card variant="outlined" class="pa-4 rounded-xl mb-8 border-light-outline overflow-y-auto" max-height="350">
            <v-row no-gutters>
              <v-col cols="12" class="mb-2" v-if="!countrySearch">
                <v-checkbox
                  v-model="form.shippingCountries"
                  label="Worldwide"
                  value="Worldwide"
                  color="#0B4F6C"
                  hide-details
                  density="compact"
                  class="font-weight-black"
                ></v-checkbox>
                <v-divider class="my-2 opacity-50"></v-divider>
              </v-col>

              <v-col
                cols="12"
                sm="6"
                v-for="country in filteredCountries"
                :key="country"
              >
                <v-checkbox
                  v-model="form.shippingCountries"
                  :label="country"
                  :value="country"
                  :disabled="form.shippingCountries.includes('Worldwide')"
                  color="#0B4F6C"
                  hide-details
                  density="compact"
                ></v-checkbox>
              </v-col>

              <v-col cols="12" v-if="countrySearch && filteredCountries.length === 0">
                <p class="text-caption text-medium-emphasis text-center py-4">No countries match "{{ countrySearch }}"</p>
              </v-col>
            </v-row>
          </v-card>

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
  shippingType: 'donator_pays',
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

const countriesList = computed(() => [...countries].sort((a, b) => a.localeCompare(b)))

const filteredCountries = computed(() => {
  const query = countrySearch.value.trim().toLowerCase()
  if (!query) return countriesList.value
  return countriesList.value.filter(country => country.toLowerCase().includes(query))
})

onMounted(async () => {
  try {
    const profile = await apiService.fetchDonatorProfile()
    if (profile) {
      form.value.socialName = profile['Social Media Name'] || ''
      form.value.waresDescription = profile['Wares Description'] || ''
      form.value.location = profile['Location'] || ''
      form.value.website = profile['Website'] || ''
      form.value.shippingType = profile['Shipping Type'] || 'donator_pays'
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