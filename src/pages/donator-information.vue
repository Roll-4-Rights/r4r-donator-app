<template>
  <!-- Main layout frame matches home page spacing -->
  <v-container class="py-10 px-6" max-width="900">
    
    <!-- Master Layout Form Card Container -->
    <v-card 
      class="rounded-2xl border-0 mb-12" 
      style="background-color: #FFFFFF !important; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.03) !important;"
      elevation="0"
    >
      <!-- Safe inner text padding boundary zone -->
      <v-card-text class="pa-6 pa-md-10">
        
        <!-- Form Header -->
        <div class="text-left mb-8">
          <h1 class="text-h4 font-weight-black text-black mb-1">Submit donator information</h1>
          <p class="text-subtitle-2 font-weight-bold text-amber-darken-3">
            <v-icon icon="mdi-alert-circle-outline" size="16" class="mr-1"></v-icon>
            Please submit this form only ONCE
          </p>
        </div>

        <v-form @submit.prevent="handleSubmitDonatorInfo">
          
          <!-- Hidden Identifying Element Payload Token -->
          <input type="hidden" :value="form.userId" />

          <!-- Input Block: Social Media Name -->
          <div class="text-subtitle-2 font-weight-bold text-black mb-2 pl-1">Social media name*</div>
          <v-text-field
            v-model="form.socialName"
            placeholder="e.g. @yourhandle on Twitter/Bluesky"
            variant="outlined"
            density="comfortable"
            class="mb-4"
            color="#0B4F6C"
            rounded="lg"
            persistent-placeholder
            required
          ></v-text-field>

          <!-- Input Block: Description of Wares -->
          <div class="text-subtitle-2 font-weight-bold text-black mb-2 pl-1">Description of your wares*</div>
          <v-textarea
            v-model="form.waresDescription"
            placeholder="Tell us about the items you handcraft, create, or donate..."
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

          <!-- Input Block: Location -->
          <div class="text-subtitle-2 font-weight-bold text-black mb-2 pl-1">Where are you located?*</div>
          <v-text-field
            v-model="form.location"
            placeholder="e.g. California, USA or London, UK"
            variant="outlined"
            density="comfortable"
            class="mb-4"
            color="#0B4F6C"
            rounded="lg"
            persistent-placeholder
            required
          ></v-text-field>

          <!-- Input Block: Website URL -->
          <div class="text-subtitle-2 font-weight-bold text-black mb-2 pl-1">Website URL*</div>
          <v-text-field
            v-model="form.website"
            placeholder="e.g. https://yourshop.com"
            variant="outlined"
            density="comfortable"
            class="mb-6"
            color="#0B4F6C"
            rounded="lg"
            persistent-placeholder
            required
          ></v-text-field>

          <v-divider class="mb-6 opacity-50"></v-divider>

          <!-- Radio Selector Block: Shipping Rules -->
          <div class="text-subtitle-2 font-weight-bold text-black mb-2 pl-1">Shipping*</div>
          <v-radio-group v-model="form.shippingType" color="#0B4F6C" class="mb-4">
            <v-radio label="I will pay for shipping" value="donator_pays" class="mb-2"></v-radio>
            <v-radio label="The item winner will pay for shipping" value="winner_pays"></v-radio>
          </v-radio-group>

          <!-- Input Block: Estimated Shipping Cost -->
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

          <!-- Input Block: How Winner Pays for Shipping -->
          <div class="text-subtitle-2 font-weight-bold text-black mb-2 pl-1">
            If applicable, how would you like your item winner to pay for shipping?
          </div>
          <v-text-field
            v-model="form.winnerPaymentMethod"
            placeholder="e.g. PayPal, Venmo, or Ko-fi link after auction closes"
            variant="outlined"
            density="comfortable"
            class="mb-6"
            color="#0B4F6C"
            rounded="lg"
            persistent-placeholder
          ></v-text-field>

          <v-divider class="mb-6 opacity-50"></v-divider>

          <!-- Country Selection Header Guidance -->
          <div class="text-left mb-4 pl-1">
            <div class="text-subtitle-2 font-weight-bold text-black"><strong>Please read carefully:</strong>
            Select what countries you *DO* you ship to, selecting <em>all that apply</em>*</div>
            <p class="text-caption text-medium-emphasis mt-1">If you ship worldwide, just select "Worldwide" at the top of the list.</p>
          </div>

          <!-- Country Search Filter Field -->
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

          <!-- DYNAMIC CHECKBOX GRID ZONE -->
          <!-- We build a responsive 2-column or 3-column scroll area to cleanly manage all countries -->
          <v-card variant="outlined" class="pa-4 rounded-xl mb-8 border-light-outline overflow-y-auto" max-height="350">
            <v-row no-gutters>
              <!-- Standard global worldwide checker card block -->
              <!-- Stays pinned above search results so it's always reachable -->
              <v-col cols="12" class="mb-2" v-if="!countrySearch">
                <v-checkbox
                  v-model="form.shipWorldwide"
                  label="Worldwide"
                  value="worldwide"
                  color="#0B4F6C"
                  hide-details
                  density="compact"
                  class="font-weight-black"
                ></v-checkbox>
                <v-divider class="my-2 opacity-50"></v-divider>
              </v-col>

              <!-- Dynamic loop rendering filtered countries list from JS script data model -->
              <!-- Disables list selection instantly if user locks in 'Worldwide' target above -->
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
                  :disabled="form.shipWorldwide"
                  color="#0B4F6C"
                  hide-details
                  density="compact"
                ></v-checkbox>
              </v-col>

              <!-- Empty state when search matches nothing -->
              <v-col cols="12" v-if="countrySearch && filteredCountries.length === 0">
                <p class="text-caption text-medium-emphasis text-center py-4">No countries match "{{ countrySearch }}"</p>
              </v-col>
            </v-row>
          </v-card>

          <!-- Form Trigger Action Layout Row -->
          <div class="d-flex justify-end">
            <v-btn 
              type="submit"
              color="#0B4F6C"
              variant="flat"
              size="large"
              class="text-none font-weight-bold rounded-lg px-12 py-2 text-white"
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
import { ref, computed } from 'vue'

const countrySearch = ref('')

const form = ref({
  userId: 'praeterusdice_99214', // 👈 Silent metadata login identity token
  socialName: '',
  waresDescription: '',
  location: '',
  website: '',
  shippingType: 'donator_pays',
  shippingCost: '',
  winnerPaymentMethod: '',
  shipWorldwide: false,
  shippingCountries: [] as string[]
})

// Triggers data bundle assembly payload
const handleSubmitDonatorInfo = () => {
  const donatorProfilePayload = {
    user_id_column: form.value.userId,
    social_handle_column: form.value.socialName,
    wares_description_column: form.value.waresDescription,
    location_column: form.value.location,
    website_column: form.value.website,
    shipping_responsibility_column: form.value.shippingType,
    estimated_cost_column: form.value.shippingCost,
    winner_payment_instructions_column: form.value.winnerPaymentMethod,
    ships_worldwide_column: form.value.shipWorldwide,
    allowed_countries_list_column: form.value.shipWorldwide ? ['ALL'] : form.value.shippingCountries,
    submitted_at: new Date().toISOString()
  }

  console.log('Donator Profile Saved successfully:', donatorProfilePayload)
  alert('Donator information package locked and ready for database transmission!')
}

// Full ISO 3166-1 list (249 entries): all UN member states + observer states
// (Vatican City, Palestine) + dependent territories (Hong Kong, Greenland, etc.)
// NOTE: Kosovo is intentionally NOT included — it has no official ISO 3166-1
// code due to the ongoing recognition dispute. Add it manually below if you
// want it as an extra 250th option.

// Order doesn't matter in this raw list — add new entries anywhere and
// they'll auto-sort into the right alphabetical spot below.
const countries = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France',
  'Afghanistan', 'Åland Islands', 'Albania', 'Algeria', 'American Samoa', 'Andorra',
  'Angola', 'Anguilla', 'Antarctica', 'Antigua & Barbuda', 'Argentina', 'Armenia',
  'Aruba', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados',
  'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia',
  'Bonaire, Sint Eustatius & Saba', 'Bosnia & Herzegovina', 'Botswana', 'Bouvet Island',
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

// Fully alphabetized, no pinned entries. localeCompare handles accented
// names correctly (Åland, Côte d'Ivoire, Curaçao, Réunion, Saint Barthélemy
// all sort where you'd expect).
const countriesList = computed(() => [...countries].sort((a, b) => a.localeCompare(b)))

// Case-insensitive substring filter over the full country list
const filteredCountries = computed(() => {
  const query = countrySearch.value.trim().toLowerCase()
  if (!query) return countriesList.value
  return countriesList.value.filter(country => country.toLowerCase().includes(query))
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