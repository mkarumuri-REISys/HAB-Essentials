<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:param name="parCurrRoleId" />
	<xsl:param name="parCurrPhaseId" />
	<xsl:param name="QueryStringInfo" />
	<xsl:param name="strPathToRoot" />
	<xsl:param name="blnPhaseSpecific" />
	<xsl:param name="EHBUrl" />
	<xsl:param name="WebsiteUrl"/>
  <xsl:param name="trainingUrl"/>
  <xsl:param name="reportsUrl"/>
	<xsl:template match="/">
		<xsl:if test="$blnPhaseSpecific">
		<TABLE border="0" cellspacing="0" cellpadding="0" align="left">
			<TR>
				<xsl:apply-templates select="headerConfig/phases"/>
			</TR>
		</TABLE>
		</xsl:if>
	</xsl:template>
	
	<xsl:template match="phases">
		<xsl:for-each select="phase[role[@id=$parCurrRoleId]]">
			<xsl:variable name="lastPosition" select="position()-1" />
			<xsl:variable name="currPhaseID" select="./@id" />
			
			<xsl:variable name="varTdBackGround">
			    <xsl:choose>
					<xsl:when test="position() =1">
						<xsl:choose>
							<xsl:when test="@id = $parCurrPhaseId">
								<xsl:value-of select="concat($strPathToRoot, 'Platform/Include/images/tab_bg_graywhite.gif')"/>
							</xsl:when>
							<xsl:otherwise>
								<xsl:value-of select="concat($strPathToRoot, 'Platform/Include/images/tab_bg_grayblue.gif')"/>
							</xsl:otherwise>	
						</xsl:choose>	        
					</xsl:when>
					
			        <xsl:otherwise>
						<xsl:choose>
							 
							<xsl:when test="@id = $parCurrPhaseId">
								<xsl:value-of select="concat($strPathToRoot, 'Platform/Include/images/tab_bg_bluewhite.gif')"/>
							 </xsl:when>
							 
							 <xsl:otherwise>
								<xsl:choose>
									
									<xsl:when test="(../phase[$lastPosition]/@id = $parCurrPhaseId)">
										<xsl:value-of select="concat($strPathToRoot, 'Platform/Include/images/tab_bg_whiteblue.gif')"/>
									</xsl:when>
									
									<xsl:otherwise>
										<xsl:value-of select="concat($strPathToRoot, 'Platform/Include/images/tab_bg_blueblue.gif')"/>
									</xsl:otherwise>
									
								</xsl:choose>		
							</xsl:otherwise>	
							
						</xsl:choose>	
					</xsl:otherwise>
			    </xsl:choose>
			</xsl:variable>
			
			<TD valign="middle" background="{$varTdBackGround}" class="linkTab" nowrap="true" height="17">
				&#160;&#160;&#160;
				<xsl:choose>
					<xsl:when test="string-length(role[@id=$parCurrRoleId]/url)!=0">
						<A class="linkTab">
							<xsl:attribute name="href">               
								<xsl:choose>
                  <xsl:when test="./@id = 'Reports'">
                    <xsl:value-of select="concat($reportsUrl,'/Core/Interface/ReportsModule/ReportsList.aspx?PRoleId=152')"/>
                  </xsl:when>
                  <xsl:otherwise>
                    <xsl:choose>
                    <xsl:when test="./@id = 'Training'">
                    <xsl:value-of select="$trainingUrl"/>
                  </xsl:when>
                    <xsl:otherwise>
                    <xsl:choose>	
									<xsl:when test="$QueryStringInfo/type[@id='HEADER']/url[@id = $currPhaseID]">
										<xsl:choose>
											<xsl:when test="contains(role[@id=$parCurrRoleId]/url, '?')">
												<xsl:choose>
													<xsl:when test="role[@id=$parCurrRoleId]/url/@alternateWebSiteUrl='true'">
														<xsl:value-of select="concat($WebsiteUrl,role[@id=$parCurrRoleId]/url,'&amp;', $QueryStringInfo/type[@id='HEADER']/url[@id = $currPhaseID] )" />
													</xsl:when>
													<xsl:when test="$EHBUrl=''">
														<xsl:value-of select="concat($strPathToRoot,role[@id=$parCurrRoleId]/url,'&amp;', $QueryStringInfo/type[@id='HEADER']/url[@id = $currPhaseID] )" />
													</xsl:when>
													<xsl:otherwise>
														<xsl:value-of select="concat($EHBUrl,role[@id=$parCurrRoleId]/url,'&amp;', $QueryStringInfo/type[@id='HEADER']/url[@id = $currPhaseID] )" />
													</xsl:otherwise>
												</xsl:choose>
											</xsl:when>
											<xsl:otherwise>
												<xsl:choose>
													<xsl:when test="role[@id=$parCurrRoleId]/url/@alternateWebSiteUrl='true'">
														<xsl:value-of select="concat($WebsiteUrl,role[@id=$parCurrRoleId]/url,'&amp;', $QueryStringInfo/type[@id='HEADER']/url[@id = $currPhaseID] )" />
													</xsl:when>
													<xsl:when test="$EHBUrl=''">
														<xsl:value-of select="concat($strPathToRoot, role[@id=$parCurrRoleId]/url,'?', $QueryStringInfo/type[@id='HEADER']/url[@id = $currPhaseID] )" />
													</xsl:when>
													<xsl:otherwise>
														<xsl:value-of select="concat($EHBUrl, role[@id=$parCurrRoleId]/url,'?', $QueryStringInfo/type[@id='HEADER']/url[@id = $currPhaseID] )" />
													</xsl:otherwise>
												</xsl:choose>
											</xsl:otherwise>
										</xsl:choose>	
									</xsl:when>
									<xsl:otherwise>
										<xsl:choose>
											<xsl:when test="role[@id=$parCurrRoleId]/url/@alternateWebSiteUrl='true'">
												<xsl:value-of select="concat($WebsiteUrl,role[@id=$parCurrRoleId]/url,'&amp;', $QueryStringInfo/type[@id='HEADER']/url[@id = $currPhaseID] )" />
											</xsl:when>
											<xsl:when test="$EHBUrl=''">
												<xsl:value-of select="concat($strPathToRoot,role[@id=$parCurrRoleId]/url)"/>
											</xsl:when>
											<xsl:otherwise>
												<xsl:value-of select="concat($EHBUrl,role[@id=$parCurrRoleId]/url)"/>
											</xsl:otherwise>
										</xsl:choose>
									</xsl:otherwise>
                  </xsl:choose>
                </xsl:otherwise>
                    </xsl:choose>  
                  </xsl:otherwise>
								</xsl:choose>		
							</xsl:attribute>
							<xsl:value-of select="@id"/>
						</A>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="@id"/>
					</xsl:otherwise>
				</xsl:choose>
			</TD>
		</xsl:for-each>
	</xsl:template>
</xsl:stylesheet>
