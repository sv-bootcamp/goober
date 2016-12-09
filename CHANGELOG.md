



# Change Log

<!--
Each version should:
  List its release date in the above format.
  Group changes to describe their impact on the project, as follows:
  Added for new features.
  Changed for changes in existing functionality.
  Deprecated for once-stable features removed in upcoming releases.
  Removed for deprecated features removed in this release.
  Fixed for any bug fixes.
  Security to invite users to upgrade in case of vulnerabilities.
Ref: http://keepachangelog.com/en/0.3.0/
-->

## Official Releases

### goober v1 

#### [1.0.9] - 2016-12-09

- Updated images/get (#155)
- Updated createdPosts/get return data form (#154)
- Added image-remove module (#156)
- Added 404 handler to admin module (#158)
- Updated POST / api/users/savedposts permission from W to R (#160) 
- Fixed FB email bug (#153)

#### [1.0.8] - 2016-12-07

- Fixed FB profile image bug
- Added argument to FB-getProfileImage (#152)

#### [1.0.7, 1.0.6] - 2016-12-06

- Removed initMock (#150)
- Added user-property assertion to signup (#149)
- Fixed facebook profile-image bug
- Removed delete-all-item apidoc
- Added caskade delete logic for created-post in item-remove
- Api/remove update to remove created post with item (#148) 

#### [1.0.5] - 2016-12-02

- Admin module for manipulating the database
- Add admin module (#147)
- Add Admin script file (#146)

#### [1.0.4] - 2016-11-30

- Blocked duplicated signup. (#138)
- Changed response status code in case un-authorized request (#144)
- CreatedPosts/image bug fix (#145)
- Added error-handler to image-controller (GET) (#139)
- Updated apidoc (#141)
- Added property assertion to image/post (#143)
- Changed log file name (#136)
- Added ping address for health-checking (#140)
- Removed lint warnings (#137)

#### [1.0.3] - 2016-11-27

- Added root page route for AWS-ELB health checking and our HTTPS domain
- Added root page route for health checking (ELB)

#### [1.0.2] - 2016-11-26

- Updated test (#134)
- Added logger (#128)
- Fixed middleware bug (#133)
- Initialized change-log (#132)
- Added isSaved property to items

#### [1.0.1] - 2016-11-25

- Stabilized authentication module
- Fixed bug at user module and routers
- Updated grant to return user key (#131)
- Refined get createdposts & fix bug (#125)
- Fixed router bug : (#126)
- Fixed no-limit date bug (#124)
- Updated to authenticate in api router (#122)
- Updated api controllers to get userKey from headers (#121)
- Updated report grant (#120)
- Updated facebook grant (#119)


#### [1.0.0] - 2016-11-18

- Initial release.
- Functionality : Authentication / Item / Image / Report / User
