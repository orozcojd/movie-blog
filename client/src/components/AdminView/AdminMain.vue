<template>
  <v-container
    fluid
  >
    <h1>Add or Delete Tags</h1>
    <v-layout
      align-center
      justify-center
    >
      <v-flex
        xs12
        md4
      >
        <v-snackbar
          v-model="snackbar"
          :timeout="6000"
          :top="true"
        >
          {{ text }}
          <v-btn
            color="pink"
            flat
            @click="snackbar = false"
          >
            Close
          </v-btn>
        </v-snackbar>
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
          />
          <v-btn
            @click="addTag"
          >
            Add To List
          </v-btn>
        </v-form>
      </v-flex>
    </v-layout>
    <v-layout
      justify-start
      row
      wrap
    >
      <v-flex
        xs12
        md4
      >
        <div>
          <h1>
            Established Tags
          </h1>
          <!-- @input="remove(tag)" -->
          <v-chip
            v-for="(tag, index) in chipTags"
            :key="index"
            close
          >
            {{ tag.name }}
          </v-chip>
        </div>
      </v-flex>
      <v-flex
        v-if="addedTags.length"
        xs12
        md4
      >
        <div>
          <h1>New Tags </h1>
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
        v-if="removedTags.length"
        md4
        xs12 
      >
        <div>
          <h1>Deleted Tags </h1>
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
    <v-layout
      justify-center
      row
      wrap
      class="mb-med"
    >
      <v-flex
        xs12
        md4
      >
        <v-btn
          to="/admin"
        >
          Cancel
        </v-btn>
        <v-btn
          :color="addRemoveBtnType"
          @click="addRemoveTags"
        >
          Add/Remove Tags
        </v-btn>
      </v-flex>
    </v-layout>
    <h1>Edit Tag Names</h1>
    <v-form
      ref="editNameForm"
      v-model="EditTagValid"
      lazy-validation
    >
      <v-layout
        row
        wrap
      >
        <v-flex
          v-for="(tag, i) in tags"
          :key="i"
          md4
          xs12
          style="padding: 15px"
        >
          <v-text-field
            :value="tags[i].name"
            :rules="tagRules"
            :counter="35"
            @input="updateTagName($event, tag._id)"
          />
        </v-flex>
      </v-layout>
      <v-layout
        justify-center
        row
        wrap
        class="mb-med"
      >
        <v-flex
          xs12
          md4
        >
          <v-btn
            to="/admin"
          >
            Cancel
          </v-btn>
          <v-btn
            :color="editNameBtnType"
            @click="updateTagNames"
          >
            Update Tag Names
          </v-btn>
        </v-flex>
      </v-layout>
    </v-form>
  </v-container>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import AdminMainValidation from '@/components/Tools/AdminMainValidation'
export default {
	name: 'AdminEditMain',
	data () {
		return {
			newTag: '',
			removedTags: [],
			addedTags: [],
			snackbar: false,
			text: '',
			addRemoveBtnType: 'default',
			editNameBtnType: 'default',
			AddTagValid: true,
			EditTagValid: true,
			tagRules: AdminMainValidation.tagRules,
			newTagRules: AdminMainValidation.newTagRules
		}
	},
	computed: {
		...mapState([
			'tags'
		]),
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
	},
	async mounted() {
		if(!this.tags){
			await this.getTags()
		}
	},
	methods: {
		...mapMutations([
			'ADD_TAGS',
			'SET_TAGS',
			'REMOVE_TAG',
			'EDIT_TAG_NAME'
		]),
		...mapActions([
			'getTags',
			'postTags',
			'deleteTags',
			'updateTags'
		]),
		updateTagName(name, id) {
			this.EDIT_TAG_NAME({
				id: id,
				name: name
			})
		},
		updateTagNames() {
			if (this.$refs.editNameForm.validate()) {
				this.updateTags(this.tags).then(() => {
					this.editNameBtnType = 'success'
				})
			}
			else {
				this.editNameBtnType = 'error'
			}
			setTimeout(() => {
				this.editNameBtnType = 'default'
			}, 1500)
		},
		addTag() {
			if (this.$refs.addTagForm.validate()) {
				let tag = this.newTag.trim()
				tag = tag.split(' ').join('-')
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
			this.ADD_TAGS([tag])
			this.removedTags.splice(this.removedTags.indexOf(tag), 1)
		},

		addRemoveTags() {
			if(this.addedTags.length){
				this.postTags(this.addedTags.map(name => ({name: name}))).then(() => {
					this.addedTags = []
				})
			}
      
			// delete tags was commented out - code unreachable
			if(this.removedTags.length) {
				this.deleteTags(this.removedTags).then(tag => {
					this.removedTags = []
					this.text= "Delete: " + tag.toString() + " tags"
					this.snackbar = true
				}
				)
			}
			// toggle success on button
			this.addRemoveBtnType = 'success'
			setTimeout(() => {
				this.addRemoveBtnType = 'default'
			}, 1500)
		}
	}
}
</script>

<style scoped>
  .mb-med {
    margin-bottom: 80px;
  }
</style>
