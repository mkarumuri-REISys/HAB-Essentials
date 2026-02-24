<?xml version="1.0" encoding="UTF-8" ?> 
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"> 
<!-- this parameters will eventually be a node retreived from the session DOM -->

<xsl:param name="sessionUserInfo" />
<xsl:variable name="rolesInfo" select="$sessionUserInfo" />
<xsl:variable name="currentRole" select="$rolesInfo/role/@id" />
<xsl:param name="sessionSectionInfo" />
<xsl:variable name="cascadeInfo" select="$sessionSectionInfo" />
<xsl:param name="LinksInfo" />
<xsl:param name="xslType" select="SIDEMENU" />
<xsl:param name="QueryStringInfo" />
<xsl:param name="strPathToRoot" />
<xsl:param name="pageID" />
<xsl:param name="itemID" />
<xsl:param name="blnIsLoggedIn" />
<xsl:param name="blnRequireLogin" />
<xsl:param name="blnOverwriteSideMenuTitle" />
<xsl:param name="strOverwriteSideMenuTitle" />
<xsl:param name="blnRequireLogoutBtn" />
<xsl:param name="strGrantPhaseId" />
<xsl:param name="closeWindowValue" select="abcd" />
<xsl:param name="userType" />
<xsl:param name="blnDisplayRegisteredLogInBtn" select="false" />  
<xsl:param name="blnDisplayLoginLogout" select="true" />
<xsl:param name="EHBUrl" />
<xsl:param name="LogoutUrl" />
	
<xsl:template match="/">
	<xsl:apply-templates select="menu" />				
</xsl:template>

<xsl:template match="menu">
	<!-- this is to display the Menu Title-->
	<table width="170" border="0" cellspacing="0" cellpadding="0">
		<tr> 
			<td width="15"></td>
			<td bgcolor="#FFFFFF"> 
				<table width="100%" border="0" cellspacing="0" cellpadding="3">
					<tr> 
						<td align="center" valign="middle"> 
						<xsl:choose>
							<xsl:when test="$blnOverwriteSideMenuTitle">
								<b><font color="003366"><xsl:value-of select="$strOverwriteSideMenuTitle" /></font></b>
							</xsl:when>
							<xsl:otherwise>
								<b><font color="003366"><xsl:value-of select="title/item" /></font></b><br/>
								<b><font color="003366"><xsl:value-of select="$strOverwriteSideMenuTitle" /></font></b>
							</xsl:otherwise>	
						</xsl:choose>
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>
	
	<!-- This calls the Section Templates which displays the Sections -->
	<table width="170" border="0" cellspacing="0" cellpadding="0">
	 	<tr>
	   		<td width="15"></td>
	   		<td width="155"> 
				<xsl:for-each select="section">
					<xsl:call-template name="section">
						<xsl:with-param name="blnOnlyOneSection">
							<xsl:choose>
								<xsl:when test="last()=1">
									<!-- IF THE SUBSECTION IS THE ONLY SUBSECTION THEN IT HAS TO BE DISPLAYED WITHOUT THE PLUS /MINUS SIGN   -->
									<xsl:value-of select="string('true')" /> 
								</xsl:when>
								<xsl:otherwise>
									<xsl:value-of select="string('false')" />
								</xsl:otherwise>
							</xsl:choose>
						</xsl:with-param>
					</xsl:call-template>
				</xsl:for-each>
			</td>
		</tr>
	</table>
	
	<!--Start - Added - To display the new blocks - this will be only for external user - 1 -->
  <xsl:choose>
    <xsl:when test="$userType!='3'">
      <xsl:for-each select="additionalsection">
        <xsl:call-template name="additionalsection">
        </xsl:call-template>
      </xsl:for-each>
    </xsl:when>
  </xsl:choose>
  
  <xsl:choose>
    <xsl:when test="$blnDisplayRegisteredLogInBtn">

      <table width="170" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td width="15"></td>
          <td bgcolor="#000000" width="155">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" bgColor="#f1f1f1">
              <tr>
                <td width="3" height="3">
                  <img>
                    <xsl:attribute name="src">
                      <xsl:value-of select="concat($strPathToRoot,'Platform/Include/images/top_left_darkGrey.gif')"/>
                    </xsl:attribute>
                  </img>
                </td>
                <td>
                  <xsl:attribute name="background">
                    <xsl:value-of select="concat($strPathToRoot,'Platform/Include/images/topLine_darkGrey.gif')"/>
                  </xsl:attribute>
                </td>
                <td width="3" height="3">
                  <img>
                    <xsl:attribute name="src">
                      <xsl:value-of select="concat($strPathToRoot,'Platform/Include/images/top_right_darkGrey.gif')"/>
                    </xsl:attribute>
                  </img>
                </td>
              </tr>
              <tr>
                <td style="BACKGROUND-REPEAT: repeat-y">
                  <xsl:attribute name="background">
                    <xsl:value-of select="concat($strPathToRoot,'Platform/Include/images/leftLine_darkGrey.gif')"/>
                  </xsl:attribute>
                </td>
                <td class="reportFont">
                  <table cellSpacing="1" cellPadding="3" width="100%" border="0" align="center">
                    <tr>
                      <td bgColor="#f1f1f1">
                        <b>Already Registered?</b>
                        <br />
                        <br />
                        <a>
                          <xsl:attribute name="href">
							  <xsl:choose>
								  <xsl:when test="$EHBUrl=''">
									  <xsl:value-of select="concat($strPathToRoot,'Login.asp')"/>
								  </xsl:when>
								  <xsl:otherwise>
									  <xsl:value-of select="concat($EHBUrl,'Login.asp')"/>
								  </xsl:otherwise>
							  </xsl:choose>
                            
                          </xsl:attribute>
                          <img border="0">
                            <xsl:attribute name="src">
                              <xsl:value-of select="concat($strPathToRoot,'Platform/Include/images/Login.jpg')"/>
                            </xsl:attribute>
                          </img>
                        </a>
                        <br />
                        <br />
                        <a>
                          <xsl:attribute name="href">
                            javascript:OpenPopup('<xsl:value-of select="concat($strPathToRoot,'help/hlpPage.asp?hF=help_password#Password Guidelines')"/>', 600, 980, 'winUserName')
                          </xsl:attribute>
                          Forgot Username?
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
                <td style="BACKGROUND-REPEAT: repeat-y">
                  <xsl:attribute name="background">
                    <xsl:value-of select="concat($strPathToRoot,'Platform/Include/images/rightLine_darkGrey.gif')"/>
                  </xsl:attribute>
                </td>
              </tr>
              <tr>
                <td width="3" height="3">
                  <img>
                    <xsl:attribute name="src">
                      <xsl:value-of select="concat($strPathToRoot,'Platform/Include/images/bottom_left_darkGrey.gif')"/>
                    </xsl:attribute>
                  </img>
                </td>
                <td>
                  <xsl:attribute name="background">
                    <xsl:value-of select="concat($strPathToRoot,'Platform/Include/images/bottomLine_darkGrey.gif')"/>
                  </xsl:attribute>
                </td>
                <td width="3" height="3">
                  <img>
                    <xsl:attribute name="src">
                      <xsl:value-of select="concat($strPathToRoot,'Platform/Include/images/bottom_right_darkGrey.gif')"/>
                    </xsl:attribute>
                  </img>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      <br/>

    </xsl:when>
  </xsl:choose>

  <!-- This displays the LOGIN/LOGOUT links depending on wether the user is logged in or logged out  -->
  <xsl:choose>
    <xsl:when test="$blnDisplayLoginLogout">
      <table width="170" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center" valign="middle">
            <xsl:choose>
              <xsl:when test="$blnIsLoggedIn">
                <xsl:choose>
                  <xsl:when test="$blnRequireLogoutBtn" >
                    <a class="linkSelected">
                      <xsl:attribute name="href">
                        <xsl:value-of select="$LogoutUrl"/>
						  <!--<xsl:choose>
							  <xsl:when test="$EHBUrl=''">
								  <xsl:value-of select="concat($strPathToRoot,'Logout.asp')"/>
							  </xsl:when>
							  <xsl:otherwise> 
                  <xsl:value-of select="concat($EHBUrl,'Logout.asp')"/>                  
							  </xsl:otherwise>
						  </xsl:choose>-->
						  <!--<xsl:value-of select="concat($strPathToRoot,'Logout.asp')"/>-->
					  </xsl:attribute>
                      <strong>Logout</strong>
                    </a>
                  </xsl:when>
                  <xsl:otherwise>
                    <a class="linkSelected">
                      <xsl:attribute name="href">
                        <xsl:value-of select="string('javascript:window.close();')"/>
                      </xsl:attribute>
                      <strong>Close Window</strong>
                    </a>
                  </xsl:otherwise>
                </xsl:choose>
              </xsl:when>
              <xsl:otherwise>
                <a class="linkSelected">
                  <xsl:attribute name="href">
					  <xsl:choose>
						  <xsl:when test="$EHBUrl=''">
							  <xsl:value-of select="concat($strPathToRoot,'Login.asp')"/>
						  </xsl:when>
						  <xsl:otherwise>
							  <xsl:value-of select="concat($EHBUrl,'Login.asp')"/>
						  </xsl:otherwise>
					  </xsl:choose>
                  </xsl:attribute>
                  <strong>Login</strong>
                </a>
              </xsl:otherwise>
            </xsl:choose>
          </td>
        </tr>
      </table>
    </xsl:when>
  </xsl:choose>

  <!-- This displays the Additional Links that might be present on a page -->
  <xsl:for-each select="$LinksInfo/link">
    <br/>
    <table width="170" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center" valign="middle">
          <a class="linkSelected">
            <xsl:attribute name="href">
              <xsl:value-of select="concat(strPathToRoot, url)" />
            </xsl:attribute>
            <strong>
              <xsl:value-of select="./@id" />
            </strong>
          </a>
        </td>
      </tr>
    </table>
  </xsl:for-each>

  <!-- End of the MENU TEMPLATE-->
</xsl:template>

<!-- Added for Action Buttons-->
<xsl:template name="additionalsection">
  <table width="170" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td width="15"></td>
      <td bgcolor="#000000" width="155">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" bgColor="#f1f1f1">
          <tr>
            <td width="3" height="3">
              <img>
                <xsl:attribute name="src">
                  <xsl:value-of select="concat($strPathToRoot,'Platform/Include/images/top_left_darkGrey.gif')"/>
                </xsl:attribute>
              </img>
            </td>
            <td>
              <xsl:attribute name="background">
                <xsl:value-of select="concat($strPathToRoot,'Platform/Include/images/topLine_darkGrey.gif')"/>
              </xsl:attribute>
            </td>
            <td width="3" height="3">
              <img>
                <xsl:attribute name="src">
                  <xsl:value-of select="concat($strPathToRoot,'Platform/Include/images/top_right_darkGrey.gif')"/>
                </xsl:attribute>
              </img>
            </td>
          </tr>
          <tr>
            <td style="BACKGROUND-REPEAT: repeat-y">
              <xsl:attribute name="background">
                <xsl:value-of select="concat($strPathToRoot,'Platform/Include/images/leftLine_darkGrey.gif')"/>
              </xsl:attribute>
            </td>
            <td class="reportFont">
              <table cellSpacing="1" cellPadding="3" width="100%" border="0" align="center">
                <tr>
                  <td bgColor="#f1f1f1">
                    <strong><xsl:value-of select="title" /></strong>
                    <xsl:for-each select="actions/action">
                    <br />
                    <br />
                    <a>
                      <xsl:attribute name="href">
                        <xsl:value-of select="concat($strPathToRoot,url)"/>
                      </xsl:attribute>
                      <img border="0">
                        <xsl:attribute name="src">
                          <xsl:value-of select="concat($strPathToRoot,image)"/>
                        </xsl:attribute>
                      </img>
                    </a>
                    </xsl:for-each>

                    <xsl:for-each select="links/link">
                      <br />
                      <br />
                      <a>
                        <xsl:attribute name="href">
                          <xsl:value-of select="concat($strPathToRoot,lurl)"/>
                        </xsl:attribute>
                        <xsl:value-of select="title" />
                      </a>
                    </xsl:for-each>

                    <xsl:for-each select="helps/help">
                        <br />
                        <br />
                        <a>
                          <xsl:attribute name="href">
                            javascript:OpenPopup('<xsl:value-of select="concat($strPathToRoot,url)"/>', 600, 980, 'winUserName')
                          </xsl:attribute>
                          <xsl:value-of select="title" />
                        </a>
                    </xsl:for-each>
                 </td>
                </tr>
              </table>
            </td>
            <td style="BACKGROUND-REPEAT: repeat-y">
              <xsl:attribute name="background">
                <xsl:value-of select="concat($strPathToRoot,'Platform/Include/images/rightLine_darkGrey.gif')"/>
              </xsl:attribute>
            </td>
          </tr>
          <tr>
            <td width="3" height="3">
              <img>
                <xsl:attribute name="src">
                  <xsl:value-of select="concat($strPathToRoot,'Platform/Include/images/bottom_left_darkGrey.gif')"/>
                </xsl:attribute>
              </img>
            </td>
            <td>
              <xsl:attribute name="background">
                <xsl:value-of select="concat($strPathToRoot,'Platform/Include/images/bottomLine_darkGrey.gif')"/>
              </xsl:attribute>
            </td>
            <td width="3" height="3">
              <img>
                <xsl:attribute name="src">
                  <xsl:value-of select="concat($strPathToRoot,'Platform/Include/images/bottom_right_darkGrey.gif')"/>
                </xsl:attribute>
              </img>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  <br/>
  
  </xsl:template>
  
  <!-- End Added for Action buttons-->

<!-- This is the SECTION TEMPLATE that displays the SECTIONS-->
<xsl:template name="section">
<xsl:param name="blnOnlyOneSection"/>


	<xsl:variable name="blnIsPhaseNeeded">
		<xsl:choose>
			<xsl:when test="@id[.='2000']">			
				<xsl:value-of select="string('true')"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="string('false')"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>

	<table width="100%" border="0" cellspacing="0" cellpadding="0">
		<tr>
			<td bgcolor="#000000">
				<table width="100%" border="0" cellspacing="1" cellpadding="0">
					 <tr>
						<td>
							<table width="100%" border="0" cellspacing="0" cellpadding="2">
								<td bgcolor="#999999" align="center">
									<font color="white"><b><xsl:value-of select="title" /></b>
									</font> 
								</td>
							</table>
						</td>
					</tr>
					<tr>
						<td bgcolor="#FFFFFF" align="left"> 
					        <table width="100%" border="0" cellspacing="0" cellpadding="1">	
								<!-- calling the SUBSECTION template -->						
								<xsl:for-each select="subsection">
									<!-- the following code checks to see if the any items require permission
									if all items require permission and the user does not have permission to any
									then the subsection is hidden-->
									<xsl:variable name="blnShowSubsection">
										<xsl:choose>
											<xsl:when test="$blnRequireLogin">			
												<xsl:choose>
													<xsl:when test="count(item) = count(item/privileges/privilege)">
														<xsl:choose>
															<xsl:when test="count(item/privileges/privilege[@id=$rolesInfo/role[@id=$currentRole]//privilege]) > 0">
																<xsl:value-of select="string('true')"/>
															</xsl:when>
															<xsl:otherwise>
																<xsl:value-of select="string('false')"/>
															</xsl:otherwise>
														</xsl:choose>
													</xsl:when>
													<xsl:otherwise>
														<xsl:value-of select="string('true')"/>
													</xsl:otherwise>
												</xsl:choose>
											</xsl:when>
											<xsl:otherwise>
												<xsl:value-of select="string('true')"/>
											</xsl:otherwise>
										</xsl:choose>
									</xsl:variable>
									<xsl:choose>
										<xsl:when test="$blnShowSubsection!='true'">
			
										</xsl:when>
										<xsl:otherwise>																						
											<xsl:call-template name="subsection">
												<xsl:with-param name="blnOnlyOneSection">
													<xsl:value-of select="$blnOnlyOneSection"/> 																										
												</xsl:with-param>
												<xsl:with-param name="blnIsPhaseNeeded">
													<xsl:value-of select="$blnIsPhaseNeeded"/>
												</xsl:with-param>																																																 
											</xsl:call-template>
										</xsl:otherwise>
									</xsl:choose>
								</xsl:for-each>
							</table>
						</td>
					</tr>
				</table>
			</td>
		</tr>
		<tr>
			<td bgcolor="#FFFFFF" height="12"><br/></td>
		</tr>
	</table>	
</xsl:template>
<!-- calling the SUBSECTION template -->


<xsl:template name="subsection">
<xsl:param name="blnOnlyOneSection"/>
<xsl:param name="blnIsPhaseNeeded"/>	
	<xsl:choose>
		<xsl:when test="(last()=1) and ($blnOnlyOneSection='true')">
			<!-- IF THE SUBSECTION IS THE ONLY SUBSECTION THEN IT HAS TO BE DISPLAYED WITHOUT THE PLUS /MINUS SIGN   -->
		</xsl:when>
		<xsl:otherwise>
			<tr>
				<!--<td width="11" align="left">-->
					<!--
					4/23/2003 - Sid Agarwal removed the expanding and collapsing of the subsections
					<a class="linkexpansion">
						<xsl:attribute name="href">
							<xsl:choose>
								<xsl:when test="contains(//item[@id= $itemID]/pages/page[@id =$pageID]/url, '?')">
									<xsl:value-of select="concat($strPathToRoot, //item[@id= $itemID]/pages/page[@id =$pageID]/url,'&amp;', 'subsectionId=', @id )" />
								</xsl:when>
								<xsl:otherwise>
									<xsl:value-of select="concat($strPathToRoot, //item[@id= $itemID]/pages/page[@id =$pageID]/url,'?subsectionId=', @id )" />
								</xsl:otherwise>
							</xsl:choose>	
						</xsl:attribute>
						<xsl:choose>
							<xsl:when test="@id[.= $cascadeInfo/subsection] ">
								<img width="11" heigth="11" border="0">
									<xsl:attribute name="src">
										<xsl:value-of select="concat($strPathToRoot,'Platform/Include/images/horiz_bold.gif')"/>
									</xsl:attribute>
								</img>
							</xsl:when>
							<xsl:otherwise>
								<img alt="Show Steps" width="11" heigth="11" border="0">
									<xsl:attribute name="src">
										<xsl:value-of select="concat($strPathToRoot,'Platform/Include/images/plus.gif')"/>
									</xsl:attribute>
								</img>
								
							</xsl:otherwise>	
						</xsl:choose>	
					</a>-->
					
					
					<!--<img width="11" heigth="11" border="0">
						<xsl:attribute name="src">
							<xsl:value-of select="concat($strPathToRoot,'Platform/Include/images/horiz_bold.gif')"/>
						</xsl:attribute>
					</img>-->
							
					
						
				<!--</td>-->	
				<!--THIS PUTS A URL TO THE SUBSECTION-->
				<td width="165" colspan="2">
					<a class="linkexpansion">
						<!--
						4/23/2003 - Sid Agarwal removed the expanding and collapsing of the subsections and also their URLS
						<xsl:attribute name="href">
							<xsl:choose>
								<xsl:when test="contains(//item[@id= $itemID]/pages/page[@id =$pageID]/url, '?')">
									<xsl:value-of select="concat($strPathToRoot, //item[@id= $itemID]/pages/page[@id =$pageID]/url,'&amp;', 'subsectionId=', @id )" />
								</xsl:when>
								<xsl:otherwise>
									<xsl:value-of select="concat($strPathToRoot, //item[@id= $itemID]/pages/page[@id =$pageID]/url,'?subsectionId=', @id )" />
								</xsl:otherwise>
							</xsl:choose>	
						</xsl:attribute>-->
						
						<!--THIS DISPLAYS THE LINK -->
						<b class="textSmall">
							<xsl:value-of select="title" />		
						</b>
					</a>
				</td>
			</tr>
		</xsl:otherwise>
	</xsl:choose>		
	<!-- IF SUBSECTIONID IS THE CURRENT SUBSECTIONID-->
	<!--4/23/2003 - Sid Agarwal removed the expanding and collapsing of the subsections
		<xsl:if test="@id[.= $cascadeInfo/subsection]">-->
		<xsl:apply-templates select="item">
			<xsl:with-param name="blnIsPhaseNeeded">
				<xsl:value-of select="$blnIsPhaseNeeded"/>
			</xsl:with-param>																																																 
		</xsl:apply-templates>
	<!--</xsl:if>-->
<!-- End of the SUBSECTION TEMPLATE-->	
</xsl:template>


<!-- calling the item template -->
<xsl:template match="item">	
	<xsl:param name="blnIsPhaseNeeded"/>
	<xsl:variable name="currItemID" select="./@id" />
	
	
	<xsl:variable name="strDisplayPhase">
		<xsl:choose>
			<xsl:when test="$blnIsPhaseNeeded='true'">			
				<xsl:choose>
					<xsl:when test="$strGrantPhaseId != ''">			
						<xsl:value-of select="$strGrantPhaseId"/>					
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="string('')"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="string('')"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>

	
	
	<xsl:choose>
		<!-- The resason there exists a loop over here is that there might exist a sidemenu that has the Privileges/privilege tabe missing -->
		<xsl:when test="privileges/privilege">
			<xsl:if test="$blnRequireLogin" >
				<xsl:apply-templates select="privileges" />
			</xsl:if>
		</xsl:when>	
		<xsl:otherwise>	
			<tr>
				<xsl:attribute name="bgcolor">
					<xsl:if test="(count(../preceding-sibling::*)+1+position()) mod 2 = 0">
						<xsl:value-of select="string('#cccccc')"/>
					</xsl:if>
					<xsl:if test="(count(../preceding-sibling::*)+1+position()) mod 2 = 1">
						<xsl:value-of select="string('White')"/>
					</xsl:if>
				</xsl:attribute>
				<!-- THIS DISPLAYS THE PLUS/MINUS SIGN -->
				<td width="11">
					<xsl:attribute name="background">
						<xsl:value-of select="concat($strPathToRoot,'Platform/Include/images/vertical_wide.gif')"/>
					</xsl:attribute>
					<xsl:choose>
						<xsl:when test="@id[.= $itemID]">
							<img width="6" heigth="4" alt="step:">
								<xsl:attribute name="src">
									<xsl:value-of select="concat($strPathToRoot,'Platform/Include/images/arrow.gif')"/>
								</xsl:attribute>
							</img>
						</xsl:when>
            <xsl:when test="@showArrow ='true'">
              <img width="6" heigth="4" alt="step:">
                <xsl:attribute name="src">
                  <xsl:value-of select="concat($strPathToRoot,'Platform/Include/images/arrow.gif')"/>
                </xsl:attribute>
              </img>
            </xsl:when>
						<xsl:otherwise>
							<img width="9" heigth="4" alt="">
								<xsl:attribute name="src">
									<xsl:value-of select="concat($strPathToRoot,'Platform/Include/images/horiz.gif')"/>
								</xsl:attribute>
							</img>
						</xsl:otherwise>	
					</xsl:choose>
				</td>		
				<td width="154">	

					<!--LOOP TO SEE IF THE CURRENT ITEM IS THE SELECTED ITEM -->
					<a class="linkSelected">
						<xsl:attribute name="href">
						<xsl:choose>
								<!-- IF THERE ARE ADDITIONAL QUERYSTRINGS THAT HAVE TO BE APPENDED-->																	
								<xsl:when test="$QueryStringInfo/type[@id='SIDEMENU']/url[@id = $currItemID]">
									<xsl:choose>
										<xsl:when test="contains(pages//page[@default = 'true']/url, '?')">
											<xsl:choose>
												<xsl:when test="$strDisplayPhase = ''">
													<!-- if completePath attribute is true, don't use strPathToRoot-->
													<xsl:choose>
														<xsl:when test="pages//page[@default = 'true']/url[@completePath='true']">
															<xsl:value-of select="concat(pages//page[@default = 'true']/url, '&amp;',$QueryStringInfo/type[@id='SIDEMENU']/url[@id = $currItemID]) "/>
														</xsl:when>
														<xsl:otherwise>
															<xsl:value-of select="concat($strPathToRoot,pages//page[@default = 'true']/url,'&amp;', $QueryStringInfo/type[@id='SIDEMENU']/url[@id = $currItemID] )" />
														</xsl:otherwise>
													</xsl:choose>													
												</xsl:when>
												<xsl:otherwise>
													<!-- if completePath attribute is true, don't use strPathToRoot-->
													<xsl:choose>
														<xsl:when test="pages//page[@default = 'true']/url[@completePath='true']">
															<xsl:value-of select="concat(pages//page[@default = 'true']/url,'&amp;', $QueryStringInfo/type[@id='SIDEMENU']/url[@id = $currItemID],'&amp;',$strDisplayPhase )" />
														</xsl:when>
														<xsl:otherwise>
															<xsl:value-of select="concat($strPathToRoot,pages//page[@default = 'true']/url,'&amp;', $QueryStringInfo/type[@id='SIDEMENU']/url[@id = $currItemID],'&amp;',$strDisplayPhase )" />
														</xsl:otherwise>
													</xsl:choose>													
												</xsl:otherwise>
											</xsl:choose>
										</xsl:when>
										<xsl:otherwise>
											<xsl:choose>
												<xsl:when test="$strDisplayPhase = ''">
													<!-- if completePath attribute is true, don't use strPathToRoot-->
													<xsl:choose>
														<xsl:when test="pages//page[@default = 'true']/url[@completePath='true']">
															<xsl:value-of select="concat(pages//page[@default = 'true']/url,'?', $QueryStringInfo/type[@id='SIDEMENU']/url[@id = $currItemID] )" />
														</xsl:when>
														<xsl:otherwise>
															<xsl:value-of select="concat($strPathToRoot,pages//page[@default = 'true']/url,'?', $QueryStringInfo/type[@id='SIDEMENU']/url[@id = $currItemID] )" />
														</xsl:otherwise>
													</xsl:choose>													
												</xsl:when>
												<xsl:otherwise>
													<!-- if completePath attribute is true, don't use strPathToRoot-->
													<xsl:choose>
														<xsl:when test="pages//page[@default = 'true']/url[@completePath='true']">
															<xsl:value-of select="concat(pages//page[@default = 'true']/url,'?', $QueryStringInfo/type[@id='SIDEMENU']/url[@id = $currItemID],'&amp;',$strDisplayPhase  )" />
														</xsl:when>
														<xsl:otherwise>
															<xsl:value-of select="concat($strPathToRoot,pages//page[@default = 'true']/url,'?', $QueryStringInfo/type[@id='SIDEMENU']/url[@id = $currItemID],'&amp;',$strDisplayPhase  )" />
														</xsl:otherwise>
													</xsl:choose>													
												</xsl:otherwise>
											</xsl:choose>
										</xsl:otherwise>
									</xsl:choose>	
								</xsl:when>		
								
								
								
								<!-- ELSE JUST DISPLAY THE REFERENCE-->


								<xsl:otherwise>					
									<xsl:choose>
										<xsl:when test="$strDisplayPhase = ''">										
											<!-- if completePath attribute is true, don't use strPathToRoot-->
											<xsl:choose>
												<xsl:when test="pages//page[@default = 'true']/url[@completePath='true']">
													<xsl:value-of select="pages//page[@default = 'true']/url" />
												</xsl:when>
												<xsl:otherwise>
													<xsl:value-of select="concat($strPathToRoot,pages//page[@default = 'true']/url)" />
												</xsl:otherwise>
											</xsl:choose>
										</xsl:when>		
										<!-- ELSE JUST DISPLAY THE REFERENCE-->
										<xsl:otherwise>	
											<xsl:choose>
												<xsl:when test="contains(pages//page[@default = 'true']/url, '?')">
													<!-- if completePath attribute is true, don't use strPathToRoot-->
													<xsl:choose>
														<xsl:when test="pages//page[@default = 'true']/url[@completePath='true']">
															<xsl:value-of select="pages//page[@default = 'true']/url + '&amp;' + $strDisplayPhase" />
														</xsl:when>
														<xsl:otherwise>
															<xsl:value-of select="concat($strPathToRoot,pages//page[@default = 'true']/url,'&amp;',$strDisplayPhase)" />
														</xsl:otherwise>
													</xsl:choose>																														
												</xsl:when>
												<xsl:otherwise>
													<!-- if completePath attribute is true, don't use strPathToRoot-->
													<xsl:choose>
														<xsl:when test="pages//page[@default = 'true']/url[@completePath='true']">
															<xsl:value-of select="concat(pages//page[@default = 'true']/url,'?',$strDisplayPhase)" />
														</xsl:when>
														<xsl:otherwise>
															<xsl:value-of select="concat($strPathToRoot,pages//page[@default = 'true']/url,'?',$strDisplayPhase)" />
														</xsl:otherwise>
													</xsl:choose>																															
												</xsl:otherwise>
											</xsl:choose>																									
										</xsl:otherwise>									
									</xsl:choose>
								</xsl:otherwise>	
								
								
								
								
							</xsl:choose>
						</xsl:attribute>			
						<!-- DISPLAYING THE TITLE-->
						<xsl:value-of select="title" />
					</a>	
				</td>
			</tr>	
		</xsl:otherwise>	
	</xsl:choose>
</xsl:template>	
<xsl:template match="privileges">
	<xsl:for-each select="privilege">
		<xsl:variable name="privilegeID" select="./@id" />
		<xsl:choose>
			<xsl:when test="$rolesInfo/role[@id=$currentRole]/privilege[. = $privilegeID]">
				<tr>
				<td width="11">
					<xsl:attribute name="background">
						<xsl:value-of select="concat($strPathToRoot,'Platform/Include/images/vertical_wide.gif')"/>
					</xsl:attribute>	
					<xsl:choose>
						<xsl:when test="../../@id[.= $itemID]">
							<img width="6" heigth="4" alt="step:">
								<xsl:attribute name="src">
									<xsl:value-of select="concat($strPathToRoot,'Platform/Include/images/arrow.gif')"/>
								</xsl:attribute>
							</img>
						</xsl:when>
            <xsl:when test="../../@showArrow = 'true'">
              <img width="6" heigth="4" alt="step:">
                <xsl:attribute name="src">
                  <xsl:value-of select="concat($strPathToRoot,'Platform/Include/images/arrow.gif')"/>
                </xsl:attribute>
              </img>
            </xsl:when>
						<xsl:otherwise>
							<img width="9" heigth="4" alt="">
								<xsl:attribute name="src">
									<xsl:value-of select="concat($strPathToRoot,'Platform/Include/images/horiz.gif')"/>
								</xsl:attribute>
							</img>
						</xsl:otherwise>	
					</xsl:choose>
				</td>	
				<td width="154">
					<!--Sid 7/9/2003 Enabling the href for the current item which is selected -->	
					<!--<xsl:choose>
						<xsl:when test="../../@id[.= $itemID]">
							<a class="linkSelected">
								<xsl:value-of select="../../title" />
							</a>
						</xsl:when>	
						<xsl:otherwise>-->
							<a class="linkSelected">
								<xsl:attribute name="href">
									<!-- if completePath attribute is true, don't use strPathToRoot-->
									<xsl:choose>
										<xsl:when test="pages//page[@default = 'true']/url[@completePath='true']">
											<xsl:value-of select="../../pages//page[@default = 'true']/url" />
										</xsl:when>
										<xsl:otherwise>
											<xsl:value-of select="concat($strPathToRoot,../../pages//page[@default = 'true']/url)" />
										</xsl:otherwise>
									</xsl:choose>									
								</xsl:attribute>
								<xsl:value-of select="../../title" />
							</a>
						<!--</xsl:otherwise>	
					</xsl:choose>-->
				</td>
			</tr>
			</xsl:when>
			<xsl:otherwise>
				<!-- hide the link completely rather than disabling it-->
				<!--<tr>
					<td width="11">
						<span>
							<xsl:attribute name="background">
								<xsl:value-of select="concat($strPathToRoot,'Platform/Include/images/vertical_wide.gif')"/>
							</xsl:attribute>
						</span>
					</td>	
					<td width="154">	
						<a class="linkDisabled">
							<xsl:value-of select="../../title" />
						</a>
					</td>
				</tr>-->
			</xsl:otherwise>
		</xsl:choose>
	</xsl:for-each>
</xsl:template>	
</xsl:stylesheet>


