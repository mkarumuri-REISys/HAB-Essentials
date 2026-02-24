<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<xsl:param name="itemID" />
	<xsl:param name="pageID" />
	<xsl:param name="blnfeedbackExists" />
	<xsl:param name="blnHomeLinkExists" />
	<xsl:param name="blnGlossaryLinkExists" />
	<xsl:param name="blnHelpLinkExists" />
	<xsl:param name="strPathToRoot" />
	<xsl:param name="strfeedbackLink" />
	<xsl:param name="strglossaryLink" />
	<xsl:param name="strhelpLink" />
	<xsl:param name="strHomeLink" />
	<xsl:param name="blnJavascriptEnabled" />
	<xsl:param name="strDefaultHelpUrl" />
	<xsl:param name="strHelpQrStrParam" />
	<xsl:param name="blnDisplayHomeLink" />
	<xsl:param name="blnContactUsLinkExists" />
	<xsl:param name="strContactUsLink" />
	<xsl:param name="blnDisplayLogoutLink" />
	<xsl:param name="strLogoutLink" />
	<xsl:param name="EHBUrl" />
	<xsl:param name="blnDisplayEHBHomeLink" />
	<xsl:param name="strEHBHomeLink" />
	<xsl:param name="strTryNewUILink" />
	<xsl:param name="blnTryNewUILink" />
	<xsl:param name="blnNewUITaskLink" />
	<xsl:param name="strNewUITaskLink" />
	<xsl:param name="blnNewUIActivitiesLink" />
	<xsl:param name="strNewUIActivitiesLink" />
	<xsl:param name="blnNewUIHomeLink" />
	<xsl:param name="strNewUIHomeLink" />
  
<xsl:param name="activitiesLink" />
  <xsl:param name="tasksPageLink" />
  
	<xsl:template match="/">
		<xsl:apply-templates select="menu" />
	</xsl:template>

	<xsl:template match="menu">
		<!-- this is to display the Menu Title-->

		<tr>
			<td>
				<b>
					<xsl:value-of select="section/subsection/item[@id=$itemID]/title" />
				</b>
			</td>
		</tr>

		<tr>
			<td>
				<xsl:if test="$blnDisplayEHBHomeLink and $strEHBHomeLink!=''">
					<u>
						<a>
							<xsl:attribute name="target">_top</xsl:attribute>
							<xsl:attribute name="href">
								<!--<xsl:value-of select="concat($EHBUrl, $strEHBHomeLink)"/>-->
                <xsl:value-of select="$strEHBHomeLink"/>
							</xsl:attribute>
							EHB home
						</a>
					</u>
					|
				</xsl:if>
				
				<xsl:if test="$blnDisplayHomeLink">
					<xsl:if test="$blnHomeLinkExists">
						<u>
							<a>
								<xsl:attribute name="target">_top</xsl:attribute>
								<xsl:attribute name="href">
									<xsl:choose>
										<xsl:when test="$EHBUrl=''">
											<xsl:value-of select="$strHomeLink"/>
										</xsl:when>
										<xsl:otherwise>
											<!--<xsl:value-of select="concat($strPathToRoot,$strHomeLink)"/>-->
                      <xsl:value-of select="$strHomeLink"/>
										</xsl:otherwise>
									</xsl:choose>
								</xsl:attribute>
								home
							</a>
						</u>
						|
					</xsl:if>
				</xsl:if>

				<xsl:if test="$blnNewUIHomeLink">
					<u>
						<a>
							<xsl:attribute name="target">_top</xsl:attribute>
							<xsl:attribute name="href">
								<!--<xsl:value-of select="concat($EHBUrl, $strNewUIHomeLink)"/>-->
                <xsl:value-of select="$strHomeLink"/>
							</xsl:attribute>
							home
						</a>
					</u>
					|
				</xsl:if>

				<xsl:if test="$blnNewUITaskLink">
					<u>
						<a>
							<xsl:attribute name="target">_top</xsl:attribute>
							<xsl:attribute name="href">
								<xsl:value-of select="$tasksPageLink"/>
							</xsl:attribute>
							tasks
						</a>
					</u>
					|
				</xsl:if>

				<xsl:if test="$blnNewUIActivitiesLink">
					<u>
						<a>
							<xsl:attribute name="target">_top</xsl:attribute>
							<xsl:attribute name="href">
								<xsl:value-of select="$activitiesLink"/>
							</xsl:attribute>
							activities
						</a>
					</u>
					|
				</xsl:if>
				

				<xsl:if test="$blnDisplayLogoutLink">
					<u>
						<a>
							<xsl:attribute name="target">_top</xsl:attribute>
							<xsl:attribute name="href">
                <xsl:value-of select="$strLogoutLink"/>
								<!--<xsl:choose>
									<xsl:when test="$EHBUrl=''">
										<xsl:value-of select="$strLogoutLink"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of select="concat($EHBUrl,$strLogoutLink)"/>
									</xsl:otherwise>
								</xsl:choose>-->
							</xsl:attribute>
							logout
						</a>
					</u>
					|
				</xsl:if>

				<xsl:if test="$blnContactUsLinkExists">
					<u>
						<a>
							<xsl:choose>
								<xsl:when test="$blnJavascriptEnabled">
									<xsl:attribute name="href">
										<xsl:choose>
											<xsl:when test="$EHBUrl=''">
												javascript:OpenPopup('<xsl:value-of select="$strContactUsLink"/>', 600, 980, 'winContactUs')
											</xsl:when>
											<xsl:otherwise>
												javascript:OpenPopup('<xsl:value-of select="$strContactUsLink"/>', 600, 980, 'winContactUs')
											</xsl:otherwise>
										</xsl:choose>
									</xsl:attribute>
								</xsl:when>
								<xsl:otherwise>
									<xsl:attribute name="target">winContactUs</xsl:attribute>
									<xsl:attribute name="href">
										<!--<xsl:choose>
											<xsl:when test="$EHBUrl=''">-->
												<xsl:value-of select="$strContactUsLink"/>
											<!--</xsl:when>
											<xsl:otherwise>
												<xsl:value-of select="concat($EHBUrl,$strContactUsLink)"/>
											</xsl:otherwise>
										</xsl:choose>-->
									</xsl:attribute>
								</xsl:otherwise>
							</xsl:choose>
							contact us
						</a>
					</u>
					|
				</xsl:if>

				<!--<xsl:if test="section/subsection/item[@id=$itemID]/pages/page[@id=$pageID]/helpUrl">
					<u>
						<a>
							<xsl:choose>
								<xsl:when test="section/subsection/item[@id=$itemID]/pages/page[@id=$pageID]/helpUrl[@useDefault!='true']">
									<xsl:choose>
										<xsl:when test="$blnJavascriptEnabled">
											<xsl:attribute name="href">
												javascript:OpenPopup('<xsl:value-of select="concat($strPathToRoot,section/subsection/item[@id=$itemID]/pages/page[@id=$pageID]/helpUrl,'#', section/subsection/item[@id=$itemID]/pages/page[@id=$pageID]/helpUrl/fName/@defaultTopic)"/>', 600, 980, 'winHelp')
											</xsl:attribute>
										</xsl:when>
										<xsl:otherwise>
											<xsl:attribute name="target">winHelp</xsl:attribute>
											<xsl:attribute name="href">
												<xsl:value-of select="concat($strPathToRoot,section/subsection/item[@id=$itemID]/pages/page[@id=$pageID]/helpUrl,'#', section/subsection/item[@id=$itemID]/pages/page[@id=$pageID]/helpUrl/fName/@defaultTopic)"/>
											</xsl:attribute>
										</xsl:otherwise>
									</xsl:choose>
								</xsl:when>
								<xsl:otherwise>
									<xsl:choose>
										<xsl:when test="$blnJavascriptEnabled">
											<xsl:attribute name="href">
												javascript:OpenPopup('<xsl:value-of select="concat($strPathToRoot,$strDefaultHelpUrl,'&amp;',$strHelpQrStrParam,'=',section/subsection/item[@id=$itemID]/pages/page[@id=$pageID]/helpUrl/fName, '#', section/subsection/item[@id=$itemID]/pages/page[@id=$pageID]/helpUrl/fName/@defaultTopic)"/>', 600, 980, 'winHelp')
											</xsl:attribute>
										</xsl:when>
										<xsl:otherwise>
											<xsl:attribute name="target">winHelp</xsl:attribute>
											<xsl:attribute name="href">
												<xsl:value-of select="concat($strPathToRoot,$strDefaultHelpUrl,'?',$strHelpQrStrParam,'=',section/subsection/item[@id=$itemID]/pages/page[@id=$pageID]/helpUrl/fName, '#', section/subsection/item[@id=$itemID]/pages/page[@id=$pageID]/helpUrl/fName/@defaultTopic)"/>
											</xsl:attribute>
										</xsl:otherwise>
									</xsl:choose>
								</xsl:otherwise>
							</xsl:choose>
							more instructions
						</a>
					</u>
					|
				</xsl:if>-->
				<!--<xsl:if test="$blnGlossaryLinkExists">
					<u>
						<a>
							<xsl:choose>
								<xsl:when test="$blnJavascriptEnabled">
									<xsl:attribute name="href">
										<xsl:choose>
											<xsl:when test="$EHBUrl=''">
												javascript:OpenPopup('<xsl:value-of select="$strglossaryLink"/>', 600, 980, 'winHelp')
											</xsl:when>
											<xsl:otherwise>
												javascript:OpenPopup('<xsl:value-of select="concat($EHBUrl, $strglossaryLink)"/>', 600, 980, 'winHelp')
											</xsl:otherwise>
										</xsl:choose>
									</xsl:attribute>
								</xsl:when>
								<xsl:otherwise>
									<xsl:attribute name="target">winHelp</xsl:attribute>
									<xsl:attribute name="href">
										<xsl:choose>
											<xsl:when test="$EHBUrl=''">
												<xsl:value-of select="$strglossaryLink"/>
											</xsl:when>
											<xsl:otherwise>
												<xsl:value-of select="concat($EHBUrl, $strglossaryLink)"/>
											</xsl:otherwise>
										</xsl:choose>
									</xsl:attribute>
								</xsl:otherwise>
							</xsl:choose>
							glossary
						</a>
					</u>
					|
				</xsl:if>-->
				<xsl:if test="$blnHelpLinkExists">
					<u>
						<a>
							<xsl:choose>
								<xsl:when test="$blnJavascriptEnabled">
									<xsl:attribute name="href">
										<!--<xsl:choose>
											<xsl:when test="$EHBUrl=''">
												javascript:OpenPopup('<xsl:value-of select="$strhelpLink"/>', 600, 980, 'winHelp')
											</xsl:when>
											<xsl:otherwise>
												javascript:OpenPopup('<xsl:value-of select="concat($strPathToRoot,$strhelpLink)"/>', 600, 980, 'winHelp')
											</xsl:otherwise>
										</xsl:choose>-->
                    javascript:OpenPopup('<xsl:value-of select="$strhelpLink"/>', 600, 980, 'winHelp')
                  </xsl:attribute>
								</xsl:when>
								<xsl:otherwise>
									<xsl:attribute name="target">winHelp</xsl:attribute>
									<xsl:attribute name="href">
										<!--<xsl:choose>
											<xsl:when test="$EHBUrl=''">
												<xsl:value-of select="$strhelpLink"/>
											</xsl:when>
											<xsl:otherwise>
												<xsl:value-of select="concat($strPathToRoot,$strhelpLink)"/>
											</xsl:otherwise>
										</xsl:choose>-->
                    <xsl:value-of select="$strhelpLink"/>
									</xsl:attribute>
								</xsl:otherwise>
							</xsl:choose>
							help
						</a>
					</u>
					<!--<xsl:if test="$blnTryNewUILink">
						|
					</xsl:if>-->
				</xsl:if>
				<!--<xsl:if test="$blnfeedbackExists">
					<u>
						<a target="new">
							<xsl:attribute name="href">
								<xsl:value-of select="$strfeedbackLink"/>
							</xsl:attribute>
							questions/comments
						</a>
					</u>
				</xsl:if>
				<xsl:if test="$blnTryNewUILink">
					|
				</xsl:if>-->
				<!--<xsl:if test="$blnTryNewUILink">
					<u>
					<span class="trynew">
								--><!-- xsl:attribute name="target">_top</xsl:attribute --><!--
							<img  alt="New" >
								<xsl:attribute name="src">
									<xsl:value-of select="concat($EHBUrl,'Platform/include/images/new1.gif')" />
								</xsl:attribute>
							</img>  
						<a>
						<xsl:attribute name="href">
								<xsl:value-of select="concat($EHBUrl, $strTryNewUILink)"/>
							</xsl:attribute>
							Try EHBs user interface "beta"
						</a>
					</span>
					</u>
				</xsl:if>-->
								
			</td>
		</tr>
	</xsl:template>

</xsl:stylesheet>


