<template>
  <v-container
    fluid
  >
    <vue-headful
      :title="headTitle"
    />
    <h1>
      Edit Tags
    </h1>
    <v-layout>
      <v-flex
        xs12
        md6
      >
        <v-alert
          class="alert"
          dismissible
          :value="true"
          type="info"
        >
          {{ alertText }}
        </v-alert>
      </v-flex>
    </v-layout>
    <v-layout
      justify-start
      row
      wrap
    >
      <v-flex
        xs12
        md6
        class="mb-med"
      >
        <h2 align="left">
          Add or Delete Tags
        </h2>
        <div 
          class="section"
          align="left"
        >
          <v-form
            ref="addTagForm"
            v-model="AddTagValid"
            lazy-validation
          >
            <v-text-field 
              v-model="newTag"
              required
              :rules="newTagRules"
              :counter="35"
              label="Enter New Tag Separated By Spaces"
              class="mb-sm"
            />
            <v-btn
              @click="addTag"
            >
              Add To List
            </v-btn>
          </v-form>
        </div>
      </v-flex>
      <v-flex
        v-if="addedTags.length"
        xs12
        md6
        class="mb-med"
      >
        <h2 align="left">
          New Tags
        </h2>
        <div
          class="section"
          align="left"
        >
          <v-chip
            v-for="(tag, index) in addedTags"
            :key="index"
            close
            @input="removeNewTag(tag)"
          >
            {{ tag }}
          </v-chip>
        </div>
      </v-flex>
      <v-flex
        v-if="enforcePermission(guesCPerm)"
        xs12
        md6
        class="mb-med"
      >
        <h2 align="left">
          Established Tags
        </h2>
        <div 
          class="section"
          align="left"
        >
          <!-- @input="remove(tag)" -->
          <v-chip
            v-for="(tag, index) in chipTags"
            :key="index"
            close
            @input="remove(tag)"
          >
            {{ tag.name }}
          </v-chip>
        </div>
      </v-flex>
      <v-flex
        v-if="removedTags.length"
        md6
        xs12
        class="mb-med"
      >
        <h2 align="left">
          Deleted Tags
        </h2>
        <div 
          class="section"
          align="left"
        >
          <v-chip
            v-for="(tag, index) in removedTags"
            :key="index"
            @click="reAddTag(tag)"
          >
            {{ tag.name }}
            <v-icon right>
              add_circle
            </v-icon>
          </v-chip>
        </div>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex>
        <v-btn
          to="/admin"
        >
          Cancel
        </v-btn>
        <v-btn
          :loading="addTagReqRunning"
          :color="addRemoveBtnType"
          @click="addRemoveTags"
        >
          Submit Tags
        </v-btn>
      </v-flex>
    </v-layout>
    <br><br>
    <h2 align="left">
      Edit Tag Names
    </h2>
    <v-form
      ref="editNameForm"
      v-model="EditTagValid"
      lazy-validation
    >
      <v-layout
        row
        wrap
        align-center
      >
        <v-flex
          v-for="(tag, i) in tags"
          :key="i"
          lg3
          sm6
          xs12
          style="padding: 15px"
        >
          <v-card>
            <v-container>
              <h2 align="left">
                {{ tags[i].name }}
              </h2>
              <v-text-field
                :value="tags[i].name"
                :rules="tagRules"
                :counter="35"
                label="Tag Name"
                :disabled="permission.name === 'CONTRIBUTOR' && tags[i].realm"
                @input="updateTag($event, 'name', tag._id)"
              />
              <v-switch
                v-if="enforcePermission(adminPerm)"
                :input-value="tags[i].realm"
                label="Use Tag as Realm"
                @change="updateTag($event, 'realm', tag._id)"
              />
              <div v-if="enforcePermission(adminPerm) && tags[i].realm">
                <v-text-field
                  :rules="imageRules"
                  :value="tags[i].img"
                  required
                  label="Realm Image"
                  hint="Enter the image URL from lensdump"
                  :disabled="!(enforcePermission(guesCPerm) || tags[i].realm)"
                  @input="updateTag($event, 'img', tag._id)"
                />
                <v-text-field
                  :rules="imageRules"
                  :value="tags[i].lazyImg"
                  required
                  label="Realm Medium Image"
                  hint="Enter the medium size image URL from lensdump"
                  :disabled="!(enforcePermission(guesCPerm) || tags[i].realm)"
                  @input="updateTag($event, 'lazyImg', tag._id)"
                />
              </div>
            </v-container>
          </v-card>
        </v-flex>
      </v-layout>
      <div align="left">
        <v-btn
          to="/admin"
        >
          Cancel
        </v-btn>
        <v-btn
          :loading="editTagReqRunning"
          :color="editNameBtnType"
          @click="updateTagInfo"
        >
          Update Tag Names
        </v-btn>
      </div>
    </v-form>
  </v-container>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import AdminMainValidation from '@/components/Tools/AdminMainValidation'
import FormValidation from '@/components/Tools/FormValidation'

export default {
	name: 'AdminEditTags',
	data () {
		return {
			newTag: '',
			removedTags: [],
			addedTags: [],
			snackText: '',
			addRemoveBtnType: 'default',
			editNameBtnType: 'default',
			AddTagValid: true,
			EditTagValid: true,
			alertText: 'Use this page to create tags, edit tag names, and edit tag images',
			/* validation rules */
			tagRules: AdminMainValidation.tagRules,
			newTagRules: AdminMainValidation.newTagRules,
			imageRules: FormValidation.imageRules,
			addTagReqRunning: false,
			editTagReqRunning: false,
			creatorPerm: ['CREATOR'],
			adminPerm: ['CREATOR', 'ADMINISTRATOR', 'GUEST'],
			guestPerm: ['CREATOR', 'ADMINISTRATOR', 'CONTRIBUTOR', 'GUEST'],
			guesCPerm: ['CREATOR', 'GUEST']
		}
	},
	computed: {
		disabled() {
			return !(!!this.user && this.user.permission === 1)
		},
		...mapState('auth', ['user', 'permission']),
		...mapState('admin',[
			'tags',
			'snackbar'
		]),
		...mapGetters('posts', ['siteTitle']),
		headTitle() {
			return `Admin Edit Tags - ${this.siteTitle}}`
		},

		chipTags: {
			get() {
				return this.tags.map(tag => ({...tag, chip:true}))
			},
			set(value) {
				this.SET_TAGS({
					type: 'tags',
					value: value
				})
			}
		},
		realmSelection: {
			get() {
				return this.ta
			}
		},
		snackVal() {
			return this.snackbar.value
		}
	},

	async mounted() {
		await this.fetchTags()
		
	},
	methods: {
		...mapMutations('admin',[
			'ADD_TAGS',
			'SET_TAGS',
			'REMOVE_TAG',
			'EDIT_TAG_VAL',
		]),
		...mapActions('admin',[
			'fetchTags',
			'postTags',
			'deleteTags',
			'updateTags',
		]),
		enforcePermission(options) {
			return options.includes(this.permission.name)
		},
		updateTag(val, type, id) {
			this.EDIT_TAG_VAL({
				id: id,
				type: type,
				val: val
			})
		},
		updateTagInfo() {
			if (this.$refs.editNameForm.validate() && !this.editTagReqRunning) {
				this.editTagReqRunning = true
				this.updateTags(this.tags)
					.then(() => {
						this.editTagReqRunning = false
						this.editNameBtnType = 'success'
					})
					.catch(() => {
						this.addRemoveBtnType = 'error'
					})
			}
			else {
				this.editNameBtnType = 'error'
			}
			setTimeout(() => {
				this.editNameBtnType = 'default'
			}, this.snackbar.timeout)
		},    
		addTag() {
			if (this.$refs.addTagForm.validate()) {
				let tag = this.newTag.trim().toLowerCase()
				// tag = tag.split(' ').join('-')
				this.addedTags.push(tag)
				this.newTag = ''
				this.AddTagValid = true
			}
		},
		remove(val) {
			this.removedTags.push(val)
			let index = this.tags.indexOf(this.tags.find(tag => tag.name === val.name))
			this.REMOVE_TAG(index)
		},
		removeNewTag(tag) {
			this.addedTags.splice(this.addedTags.indexOf(tag), 1)
		},
		reAddTag(tag) {
			this.ADD_TAGS({
				tags: [tag]
			})
			this.removedTags.splice(this.removedTags.indexOf(tag), 1)
		},

		async addRemoveTags() {
			if(this.addedTags.length && !this.addTagReqRunning){
				this.addTagReqRunning = true
				await this.postTags(this.addedTags.map(name => ({name: name})))
					.then(() => {
						this.addTagReqRunning = false
						this.addRemoveBtnType = 'success'
						this.addedTags = []
					})
					.catch(() => {
						this.addRemoveBtnType = 'error'
					})
			}
			// if delete tags was commented out - this code is unreachable
			if(this.removedTags.length && !this.addTagReqRunning) {
				this.addTagReqRunning = true
				await this.deleteTags(this.removedTags)
					.then(() => this.addRemoveBtnType = 'success')
					.catch(() => {
						this.addRemoveBtnType = 'error'
					})
			}
			setTimeout(() => {
				this.addRemoveBtnType = 'default'
			}, this.snackbar.timeout)
		}
	}
}
</script>

<style scoped>
  .alert {
    font-size: 1.2rem;
    margin-bottom: 2rem;
  }
  .mb-sm {
    margin-bottom: 1rem;
  }
  .mb-med {
    margin-bottom: 3rem;
  }
  h1 {
    font-size: 4rem;
    margin-bottom: 2.5rem;
  }
  .section {
    padding: 1em;
  }
</style>
