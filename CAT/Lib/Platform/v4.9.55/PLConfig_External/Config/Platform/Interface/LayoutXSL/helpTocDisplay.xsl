<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html"/>
	<xsl:param name="strPathToRoot" />
	<xsl:param name="strDefaultHelpUrl" />
	<xsl:param name="strHelpQrStrParam" />
	<xsl:param name="strCallCenterPhone" />
	<xsl:param name="strCallCenterEmail" />
	<xsl:param name="strExternalHelpUrls" />
	
	<xsl:template match="/">
		<br/>
		<table width="95%" border="0" align="center" cellspacing="1" cellpadding="3">	
			<tr> 
				<td class="normal">
					Below is a list of topics that would help answer your questions regarding 
					different features and functionalities of the system. Click on a topic to view 
					more information on it. If your question is still not answered, contact HRSA 
					Call Center at <xsl:value-of select="$strCallCenterPhone"/> or email 
					<A><xsl:attribute name="href"><xsl:value-of select="concat('mailto:',$strCallCenterEmail)"/></xsl:attribute><xsl:value-of select="$strCallCenterEmail"/></A> or click on the questions/comments link above.
				</td>	
			</tr>
		</table>
		<br/>
		<table width="95%" border="0" align="center" cellspacing="0" cellpadding="0">					
			<tr>
				<td bgcolor="#000000">	
					<table width="100%" border="0" cellspacing="1" cellpadding="3">	
						<tr> 
							<td class="headerMain" colspan="1" align="left" height="20" bgColor="#ffffff">
								Help - <xsl:value-of select="helpTOC/@title"/>
							</td>	
						</tr>					
						<tr> 
							<td class="headerSec" colspan="1" align="left" height="20" bgColor="#ffffff">
								All Topics
							</td>	
						</tr>
						<tr align="left">
							<td class="bgWhite" height="20" colspan="1" bgcolor="#ffffff">
								<xsl:apply-templates select="helpTOC/section"/>
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>
	</xsl:template>
	<xsl:template match="helpTOC/section">
		<table border='0'>
			<tr>
				<td>
					<xsl:call-template name="renderSection">
						<xsl:with-param name="blnFirstSection">
							<xsl:value-of select="true()"/>
						</xsl:with-param>
					</xsl:call-template>
				</td>
			</tr>
		</table>
	</xsl:template>
	<xsl:template name="renderSection">		
		<xsl:param name="blnFirstSection"/>
		<xsl:variable name="externalHelpID" select="helpUrl/@externalHelpID" />
		<a class="informationMsg">
			<xsl:choose>
				<xsl:when test="helpUrl[@useDefault!='true']">	
					<xsl:attribute name="href">
						<xsl:choose>
							<xsl:when test="$externalHelpID !=''">
								<xsl:call-template name="GetExternalHelpUrl">
									<xsl:with-param name="id" select="$externalHelpID" />
								</xsl:call-template>
							</xsl:when>
							<xsl:otherwise>
								<xsl:value-of select="concat($strPathToRoot,helpUrl)"/>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:attribute>
				</xsl:when>
				<xsl:otherwise>
					<xsl:attribute name="href">
						<xsl:choose>
							<xsl:when test="contains($strDefaultHelpUrl, '?')">
								<xsl:value-of select="concat($strPathToRoot,$strDefaultHelpUrl,'&amp;',$strHelpQrStrParam,'=',helpUrl/fName, '#', helpUrl/fName/@defaultTopic)"/>
							</xsl:when>
							<xsl:otherwise>
								<xsl:value-of select="concat($strPathToRoot,$strDefaultHelpUrl,'?',$strHelpQrStrParam,'=',helpUrl/fName, '#', helpUrl/fName/@defaultTopic)"/>
							</xsl:otherwise>								
						</xsl:choose>
					</xsl:attribute>
				</xsl:otherwise>
			</xsl:choose>
			<xsl:value-of select="@title"/>
		</a>
		<xsl:for-each select="section">
			<table border='0'>
			<tr>
				<td valign='center' align='left' rowspan='$childCount'>
					<xsl:attribute name="background">
						<xsl:value-of select="concat($strPathToRoot,'platform/include/images/vertical_wide.gif')"/>
					</xsl:attribute>
				</td>
				<td>
					<img width="9" heigth="4" alt="">
						<xsl:attribute name="src">
							<xsl:value-of select="concat($strPathToRoot,'platform/include/images/horiz.gif')"/>
						</xsl:attribute>
					</img>
					<xsl:call-template name="renderSection">
						<xsl:with-param name="blnFirstSection">
							<xsl:value-of select="false()"/>
						</xsl:with-param>
					</xsl:call-template>
				</td>
			</tr>
			</table>
		</xsl:for-each>
	</xsl:template>

	<!-- get external help url function -->
	<xsl:template name="GetExternalHelpUrl">
		<xsl:param name="id"/>
		<xsl:for-each select="($strExternalHelpUrls)/url">
			<xsl:if test="@id=$id">
				<xsl:value-of select="child::node()[1]"/>
			</xsl:if>
		</xsl:for-each>
	</xsl:template>
</xsl:stylesheet>
